const base = () => process.env.NEXT_PUBLIC_API_URL || "/api/v1";

/** Parses FastAPI-style JSON error bodies thrown from apiFetch. */
export function parseApiErrorMessage(err: unknown): string {
  if (!(err instanceof Error) || !err.message) return "Something went wrong.";
  const raw = err.message.trim();
  if (!raw.startsWith("{")) return raw;
  try {
    const j = JSON.parse(raw) as { detail?: string | { msg: string }[] };
    const d = j.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d))
      return d.map((x) => (typeof x === "object" && x && "msg" in x ? String((x as { msg: string }).msg) : String(x))).join(" ");
  } catch {
    /* ignore */
  }
  return raw;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers,
    credentials: "include",
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type");
  if (ct && ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as T;
}
