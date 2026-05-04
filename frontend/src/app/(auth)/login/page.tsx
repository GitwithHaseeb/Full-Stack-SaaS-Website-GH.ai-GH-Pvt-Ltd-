"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseApiErrorMessage } from "@/lib/api-client";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(parseApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Welcome back</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
