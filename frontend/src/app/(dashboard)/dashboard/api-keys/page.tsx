"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";

type ApiKeyRow = { id: string; name: string; key_prefix: string; created_at: string; revoked_at: string | null };

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [plaintext, setPlaintext] = useState<string | null>(null);

  async function refresh() {
    const data = await apiFetch<ApiKeyRow[]>("/api-keys/");
    setKeys(data);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function generate() {
    const created = await apiFetch<{ plaintext_key: string }>("/api-keys/", { method: "POST", json: { name: "CLI" } });
    setPlaintext(created.plaintext_key);
    await refresh();
  }

  async function revoke(id: string) {
    await apiFetch(`/api-keys/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="text-sm text-muted-foreground">Programmatic access to GH.ai endpoints.</p>
        </div>
        <Button onClick={() => void generate()}>Generate key</Button>
      </div>
      {plaintext ? (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>Copy your key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">This value is shown once.</p>
            <code className="block rounded-md bg-muted p-3 text-xs">{plaintext}</code>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Active keys</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>{k.name}</TableCell>
                  <TableCell>{k.key_prefix}…</TableCell>
                  <TableCell>{new Date(k.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => void revoke(k.id)}>
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
