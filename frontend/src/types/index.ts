export type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  pipeline_stage: string;
  notes?: string | null;
  last_contacted_at?: string | null;
  assigned_agent: boolean;
  fit_score?: number | null;
  acquisition_source?: string | null;
  created_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  trigger_type: string;
  trigger_days?: number | null;
  subject?: string | null;
  body?: string | null;
  created_at: string;
};
