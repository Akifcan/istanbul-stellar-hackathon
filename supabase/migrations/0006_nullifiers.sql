-- ZK nullifiers: each eligible user counts at most once per campaign.
create table if not exists public.nullifiers (
  nullifier   text primary key,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.nullifiers enable row level security;
