import type { Request } from "express";

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user: User;
}
