import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000";

async function getSessionToken() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.session?.token) {
    return null;
  }
  return session.session.token;
}

async function proxyRequest(method: string, path: string[], body?: any) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = `${BACKEND}/api/${path.join("/")}`;
  const init: RequestInit = {
    method,
    headers: { Authorization: `Bearer ${token}` },
  };

  if (body !== undefined) {
    (init.headers as Record<string, string>)["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(target, init);
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await req.json();
  return proxyRequest("POST", path, body);
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest("GET", path);
}

export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await req.json();
  return proxyRequest("PUT", path, body);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest("DELETE", path);
}
