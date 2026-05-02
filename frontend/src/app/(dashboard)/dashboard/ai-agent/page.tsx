"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";

type AIConfig = {
  enabled: boolean;
  human_in_loop: boolean;
  custom_instructions: string;
  recent_decisions: { intent?: string; preview?: string }[];
};

export default function AiAgentPage() {
  const [cfg, setCfg] = useState<AIConfig | null>(null);

  async function load() {
    const data = await apiFetch<AIConfig>("/ai-agent/config");
    setCfg(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(next: Partial<AIConfig>) {
    if (!cfg) return;
    const merged = { ...cfg, ...next };
    const saved = await apiFetch<AIConfig>("/ai-agent/config", { method: "PUT", json: merged });
    setCfg(saved);
  }

  if (!cfg) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">AI Agent</h1>
        <p className="text-sm text-muted-foreground">Control automation, approvals, and guardrails.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable AI reply assistant</div>
              <p className="text-sm text-muted-foreground">Turn off to pause automated drafting.</p>
            </div>
            <Switch checked={cfg.enabled} onCheckedChange={(v) => void save({ enabled: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Human in the loop</div>
              <p className="text-sm text-muted-foreground">Require approval before sending AI drafts.</p>
            </div>
            <Switch checked={cfg.human_in_loop} onCheckedChange={(v) => void save({ human_in_loop: v })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Custom instructions</Label>
            <Textarea
              id="instructions"
              rows={6}
              value={cfg.custom_instructions}
              onChange={(e) => setCfg({ ...cfg, custom_instructions: e.target.value })}
            />
            <Button type="button" onClick={() => void save({ custom_instructions: cfg.custom_instructions })}>
              Save instructions
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent AI decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {cfg.recent_decisions?.length ? (
            cfg.recent_decisions.map((d, idx) => (
              <div key={idx} className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">{d.intent}</div>
                <div className="mt-1 text-foreground">{d.preview}</div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No decisions logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
