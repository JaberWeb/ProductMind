import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";
import contentRoutes from "./routes/content";
import itemsRoutes from "./routes/items";
import contactRoutes from "./routes/contact";
import chatRoutes from "./routes/chat";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/myapp");
const db = client.db(process.env.DATABASE_NAME || "myapp");

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/test", (_req, res) => {
  res.json({ status: "ok", message: "Backend is live", timestamp: new Date().toISOString() });
});

app.use("/api", contactRoutes);

async function authMiddleware(req: any, res: any, next: any) {
  if (req.path === "/health") { next(); return; }

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized. No token provided." });
    return;
  }

  const token = header.split(" ")[1];
  const session = await db.collection("session").findOne({ token });

  if (!session) {
    res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
    return;
  }

  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    await db.collection("session").deleteOne({ token });
    res.status(401).json({ error: "Session expired." });
    return;
  }

  const userId = session.userId;
  const userQuery = { _id: userId };
  const user = await db.collection("user").findOne(userQuery);
  if (!user) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  req.user = user;
  next();
}

app.use("/api", authMiddleware);
app.locals.db = db;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", uploadRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", contentRoutes);
app.use("/api", itemsRoutes);
app.use("/api", chatRoutes);
app.use("/api", dashboardRoutes);

async function start() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();