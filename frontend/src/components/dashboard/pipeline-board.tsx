"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import type { Lead } from "@/types";

const stages = ["New Lead", "Contacted", "Meeting Scheduled", "Closed"] as const;

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[220px] space-y-2 rounded-md border border-dashed p-2 ${isOver ? "border-primary/60 bg-primary/5" : ""}`}
    >
      {children}
    </div>
  );
}

function DraggableLead({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 10 : undefined,
      }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-md border bg-card p-3 text-sm active:cursor-grabbing"
    >
      <div className="font-medium">{lead.name}</div>
      <div className="text-xs text-muted-foreground">{lead.email}</div>
    </div>
  );
}

export function PipelineBoard({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of stages) map[s] = [];
    for (const l of leads) {
      if (!map[l.pipeline_stage]) map[l.pipeline_stage] = [];
      map[l.pipeline_stage].push(l);
    }
    return map;
  }, [leads]);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const leadId = String(active.id);
    let targetStage: string | null = null;
    if (stages.includes(over.id as (typeof stages)[number])) {
      targetStage = String(over.id);
    } else {
      const overLead = leads.find((l) => l.id === over.id);
      if (overLead) targetStage = overLead.pipeline_stage;
    }
    if (!targetStage) return;
    const prev = leads;
    setLeads((p) => p.map((l) => (l.id === leadId ? { ...l, pipeline_stage: targetStage! } : l)));
    try {
      await apiFetch(`/leads/${leadId}`, { method: "PUT", json: { pipeline_stage: targetStage } });
    } catch {
      setLeads(prev);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-4">
        {stages.map((stage) => (
          <Card key={stage} className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <DroppableColumn id={stage}>
                {(grouped[stage] || []).map((lead) => (
                  <DraggableLead key={lead.id} lead={lead} />
                ))}
              </DroppableColumn>
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}
