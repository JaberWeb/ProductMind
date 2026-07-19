import type { Request, Response, NextFunction } from "express";
import { getDB } from "../db";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.path === "/health") { next(); return; }

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized. No token provided." });
      return;
    }

    const token = header.split(" ")[1];
    const db = getDB();
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

    const user = await db.collection("user").findOne({ _id: session.userId });
    if (!user) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified ?? false,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as AuthUser;

    next();
  } catch {
    res.status(500).json({ error: "Authentication error" });
  }
}
