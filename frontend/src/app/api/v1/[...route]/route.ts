import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";

async function forward(req: NextRequest, segments: string[]) {
  const path = segments.join("/");
  const url = new URL(req.url);
  const target = `${BACKEND}/api/v1/${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    const buf = await req.arrayBuffer();
    init.body = buf;
  }

  const res = await fetch(target, init);
  const out = new NextResponse(res.body, { status: res.status });

  const setCookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  if (setCookies.length) {
    for (const c of setCookies) {
      out.headers.append("Set-Cookie", c);
    }
  } else {
    const single = res.headers.get("set-cookie");
    if (single) out.headers.append("Set-Cookie", single);
  }

  res.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "set-cookie" || k === "transfer-encoding") return;
    out.headers.set(key, value);
  });

  return out;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}

export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ route: string[] }> }) {
  const { route } = await ctx.params;
  return forward(req, route);
}
