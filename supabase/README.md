# Supabase Hybrid Backend Foundation

This folder prepares Life Guidance Pro for Firebase -> Supabase hybrid mode without changing the live frontend flow.

## What is included

- SQL migration for:
  - AI memory snapshots
  - behavioral snapshots
  - recommendations
  - conversations
  - usage events
- pgvector extension setup
- realtime publication entries
- RLS starter policies

## Current strategy

- Firebase remains the production source of truth
- Supabase acts as an optional mirror for adaptive AI intelligence artifacts
- Server-side writes are gated by environment flags

## Recommended rollout

1. Apply the migration in a Supabase development branch
2. Enable `ENABLE_SUPABASE_MIRROR=true` only in staging first
3. Verify mirrored rows and realtime events
4. Add authenticated Supabase browser access later for selective reads
5. Migrate one feature surface at a time
