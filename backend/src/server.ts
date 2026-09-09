import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "DocuCraft API Server is running!",
    timestamp: new Date().toISOString(),
  });
});
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 [Server]: Server is running on http://localhost:${PORT}`);
      console.log(`🏥 [Health Check]: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ [Server]: Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
