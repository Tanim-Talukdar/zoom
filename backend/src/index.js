import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { connectToSocket } from "./controller/socketManager.js";
import userRoutes from "./routes/users.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.set("port", PORT);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    server.listen(app.get("port"), () => {
      console.log(`Server is running on http://localhost:${app.get("port")}/api/v1/users`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

start();
