require('dotenv').config()

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.KAFKA_BROKERS) console.warn("KAFKA_BROKERS not set, defaulting to localhost:9092");

import { PrismaPg } from "@prisma/adapter-pg";
import { Kafka } from "kafkajs";
import { Pool } from "pg";
import { sendEmail } from "./email";
import { Prisma, PrismaClient } from "./generated/client";
import { parse } from "./parser";
import { sendSol } from "./solana";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClient = new PrismaClient({ adapter });
const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
  clientId: 'outbox-processor-2',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
})

async function main() {
  const consumer = kafka.consumer({ groupId: 'main-worker-2' });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      })
      if (!message.value?.toString()) {
        return;
      }

      const parsedValue: { zapRunId: string, stage: number } = JSON.parse(message.value?.toString());
      const zapRunId = parsedValue.zapRunId;
      const stage = parsedValue.stage;

      // Idempotency check
      const existingStatus = await prismaClient.zapRunAction.findUnique({
        where: {
          zapRunId_stage: {
            zapRunId,
            stage
          }
        }
      });

      if (existingStatus?.status === "SUCCESS") {
        console.log(`Action for zapRunId ${zapRunId} at stage ${stage} already completed. Skipping.`);
        return;
      }

      const zapRunDetails = await prismaClient.zapRun.findFirst({
        where: { id: zapRunId },
        include: {
          zap: {
            include: {
              actions: {
                include: { type: true }
              }
            }
          },
        }
      });
      const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

      if (!currentAction || !zapRunDetails) {
        console.log("Current action or zap run details not found?");
        return;
      }

      const zapRunMetadata = zapRunDetails.metadata;

      try {
        if (currentAction.type.id === "email") {
          const body = parse((currentAction.metadata as Prisma.JsonObject)?.body as string || "", zapRunMetadata);
          const to = parse((currentAction.metadata as Prisma.JsonObject)?.email as string || "", zapRunMetadata);
          console.log(`Sending out email to ${to} body is ${body}`)
          await sendEmail(to, body);
        }

        if (currentAction.type.id === "send-sol") {
          const amount = parse((currentAction.metadata as Prisma.JsonObject)?.amount as string || "", zapRunMetadata);
          const address = parse((currentAction.metadata as Prisma.JsonObject)?.address as string || "", zapRunMetadata);
          console.log(`Sending out SOL of ${amount} to address ${address}`);
          const signature = await sendSol(address, amount);

          await prismaClient.zapRunAction.upsert({
            where: { zapRunId_stage: { zapRunId, stage } },
            update: { status: "SUCCESS", signature },
            create: { zapRunId, stage, status: "SUCCESS", signature }
          });
        }

        if (currentAction.type.id !== "send-sol") {
          await prismaClient.zapRunAction.upsert({
            where: { zapRunId_stage: { zapRunId, stage } },
            update: { status: "SUCCESS" },
            create: { zapRunId, stage, status: "SUCCESS" }
          });
        }
      } catch (e) {
        console.error("Failed to execute action", e);
        await prismaClient.zapRunAction.upsert({
          where: { zapRunId_stage: { zapRunId, stage } },
          update: { status: "FAILED" },
          create: { zapRunId, stage, status: "FAILED" }
        });
        return; // Don't proceed to next stage if this one failed
      }

      const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1; // 1
      console.log(lastStage);
      console.log(stage);
      if (lastStage !== stage) {
        console.log("pushing back to the queue")
        await producer.send({
          topic: TOPIC_NAME,
          messages: [{
            value: JSON.stringify({
              stage: stage + 1,
              zapRunId
            })
          }]
        })
      }

      console.log("Flow processing done");
      // 
      await consumer.commitOffsets([{
        topic: TOPIC_NAME,
        partition: partition,
        offset: (parseInt(message.offset) + 1).toString() // 5
      }])
    },
  })

}

main()

