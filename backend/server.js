import dotenv from "dotenv";
dotenv.config(); // Must run FIRST before any other imports read process.env

import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/socket.js";
import authRoutes from "./routes/auth.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", process.env.CLIENT_URL].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Socket.IO
const io = initSocket(server);
app.set("io", io);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend in production
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => {
    // Only handle non-API routes
    if (!req.path.startsWith("/api/")) {
      res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    }
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/interview", interviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 InterviewIQ Server running on port ${PORT}`);
  });
});
