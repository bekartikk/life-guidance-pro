create or replace function public.match_ai_memory_snapshots(
  query_embedding vector(1536),
  filter_external_user_id text default null,
  match_count integer default 6
)
returns table (
  id uuid,
  external_user_id text,
  memory_scope text,
  summary text,
  memory_json jsonb,
  created_at timestamptz,
  similarity_distance double precision
)
language sql
stable
as $$
  select
    ai_memory_snapshots.id,
    ai_memory_snapshots.external_user_id,
    ai_memory_snapshots.memory_scope,
    ai_memory_snapshots.summary,
    ai_memory_snapshots.memory_json,
    ai_memory_snapshots.created_at,
    ai_memory_snapshots.embedding_vector <=> query_embedding as similarity_distance
  from public.ai_memory_snapshots
  where ai_memory_snapshots.embedding_vector is not null
    and (filter_external_user_id is null or ai_memory_snapshots.external_user_id = filter_external_user_id)
  order by ai_memory_snapshots.embedding_vector <=> query_embedding
  limit greatest(match_count, 1);
$$;
