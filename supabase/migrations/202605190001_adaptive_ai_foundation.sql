create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.ai_memory_snapshots (
  id uuid primary key default gen_random_uuid(),
  owner_auth_uid uuid null,
  external_user_id text not null,
  external_email text not null default '',
  memory_scope text not null default 'adaptive_guidance',
  summary text not null,
  memory_json jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'pending',
  embedding_model text null,
  embedding_vector vector(1536) null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_behavior_snapshots (
  id uuid primary key default gen_random_uuid(),
  owner_auth_uid uuid null,
  external_user_id text not null,
  external_email text not null default '',
  workspace_mode text not null default 'focus',
  burnout_risk_score integer not null default 0,
  momentum_score integer not null default 0,
  cognitive_load_score integer not null default 0,
  behavior_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  owner_auth_uid uuid null,
  external_user_id text not null,
  external_email text not null default '',
  recommendation_type text not null default 'adaptive',
  title text not null,
  detail text not null default '',
  why text not null default '',
  priority integer not null default 1,
  recommendation_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  owner_auth_uid uuid null,
  external_user_id text not null,
  external_email text not null default '',
  conversation_type text not null,
  current_plan_id text null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null,
  content text not null default '',
  structured_payload jsonb null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  owner_auth_uid uuid null,
  external_user_id text not null,
  external_email text not null default '',
  endpoint text not null,
  provider text not null,
  model text not null,
  status text not null,
  cache_hit boolean not null default false,
  latency_ms integer null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_memory_snapshots_external_user_id_created_at
  on public.ai_memory_snapshots (external_user_id, created_at desc);
create index if not exists idx_ai_behavior_snapshots_external_user_id_created_at
  on public.ai_behavior_snapshots (external_user_id, created_at desc);
create index if not exists idx_ai_recommendations_external_user_id_created_at
  on public.ai_recommendations (external_user_id, created_at desc);
create index if not exists idx_ai_conversations_external_user_id_created_at
  on public.ai_conversations (external_user_id, created_at desc);
create index if not exists idx_ai_usage_events_external_user_id_created_at
  on public.ai_usage_events (external_user_id, created_at desc);
create index if not exists idx_ai_conversation_messages_conversation_id_created_at
  on public.ai_conversation_messages (conversation_id, created_at asc);

create index if not exists idx_ai_memory_snapshots_embedding_cosine
  on public.ai_memory_snapshots
  using ivfflat (embedding_vector vector_cosine_ops)
  with (lists = 100);

alter table public.ai_memory_snapshots enable row level security;
alter table public.ai_behavior_snapshots enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_conversation_messages enable row level security;
alter table public.ai_usage_events enable row level security;

drop policy if exists "ai_memory_snapshots_owner_select" on public.ai_memory_snapshots;
create policy "ai_memory_snapshots_owner_select"
  on public.ai_memory_snapshots
  for select
  to authenticated
  using (owner_auth_uid is not null and owner_auth_uid = auth.uid());

drop policy if exists "ai_behavior_snapshots_owner_select" on public.ai_behavior_snapshots;
create policy "ai_behavior_snapshots_owner_select"
  on public.ai_behavior_snapshots
  for select
  to authenticated
  using (owner_auth_uid is not null and owner_auth_uid = auth.uid());

drop policy if exists "ai_recommendations_owner_select" on public.ai_recommendations;
create policy "ai_recommendations_owner_select"
  on public.ai_recommendations
  for select
  to authenticated
  using (owner_auth_uid is not null and owner_auth_uid = auth.uid());

drop policy if exists "ai_conversations_owner_select" on public.ai_conversations;
create policy "ai_conversations_owner_select"
  on public.ai_conversations
  for select
  to authenticated
  using (owner_auth_uid is not null and owner_auth_uid = auth.uid());

drop policy if exists "ai_conversation_messages_owner_select" on public.ai_conversation_messages;
create policy "ai_conversation_messages_owner_select"
  on public.ai_conversation_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ai_conversations c
      where c.id = conversation_id
        and c.owner_auth_uid is not null
        and c.owner_auth_uid = auth.uid()
    )
  );

drop policy if exists "ai_usage_events_owner_select" on public.ai_usage_events;
create policy "ai_usage_events_owner_select"
  on public.ai_usage_events
  for select
  to authenticated
  using (owner_auth_uid is not null and owner_auth_uid = auth.uid());

do $$
begin
  begin
    alter publication supabase_realtime add table public.ai_recommendations;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.ai_behavior_snapshots;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.ai_conversations;
  exception when duplicate_object then null;
  end;
end
$$;
