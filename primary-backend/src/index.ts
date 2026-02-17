
import cors from "cors";
import express from "express";
import { actionRouter } from "./router/action";
import { triggerRouter } from "./router/trigger";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";

const app = express();

// Configure CORS options
const corsOptions = {
  origin: "https://zflow.soumitrakonar.me",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS middleware first
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

app.listen(3001);