import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import watchlistRoutes from "./routes/watchlist.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import aiRoutes from "./routes/ai.routes.js";


import authRoutes from "./routes/auth.routes.js";
import marketRoutes from "./routes/market.routes.js";
import advisorRoutes from "./routes/advisor.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import brokerRoutes from "./routes/broker.routes.js";

import { initSocket } from "./sockets/index.js";
import { connectRabbitMQ } from "./services/rabbitmq.service.js";
import { startTradeWorker } from "./workers/trade.worker.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/broker", brokerRoutes);
// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initialize sockets
initSocket(io);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await connectRabbitMQ();
    startTradeWorker();
  })
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});