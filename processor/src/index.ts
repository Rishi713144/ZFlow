import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Kafka } from "kafkajs";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.KAFKA_BROKERS) console.warn("KAFKA_BROKERS not set, defaulting to localhost:9092");

const TOPIC_NAME = "zap-events"

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const client = new PrismaClient({ adapter });

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
})

async function main() {
    const producer = kafka.producer();
    await producer.connect();

    while (1) {
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10
        })
        console.log(`Processing ${pendingRows.length} pending flow runs`);

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => {
                return {
                    value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                }
            })
        })

        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        })

        await new Promise(r => setTimeout(r, 3000));
    }
}

main();