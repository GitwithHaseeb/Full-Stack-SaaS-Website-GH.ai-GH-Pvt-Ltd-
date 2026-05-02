import { apiFetch } from "@/lib/api-client";

export type TokenPair = { access_token: string; refresh_token: string; token_type: string };

export async function login(email: string, password: string) {
  return apiFetch<TokenPair>("/auth/login", { method: "POST", json: { email, password } });
}

export async function register(email: string, password: string, company?: string) {
  return apiFetch<TokenPair>("/auth/register", {
    method: "POST",
    json: { email, password, company_name: company?.trim() ? company : null },
  });
}

export async function logout() {
  return apiFetch<{ status: string }>("/auth/logout", { method: "POST" });
}

export async function fetchMe() {
  return apiFetch<{
    id: string;
    email: string;
    full_name: string | null;
    company: string | null;
  }>("/users/me");
}
