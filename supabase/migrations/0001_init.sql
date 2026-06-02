-- AdProof initial schema
-- Tables mirror the frontend domain types:
--   PublisherApiKey -> public.api_keys
--   AdCampaign      -> public.campaigns
-- Auth is wallet-based (outside Supabase Auth) for now, so rows are scoped by
-- the connected Stellar wallet address. RLS is enabled with no public policies:
-- server-side access uses the secret (service_role) key, which bypasses RLS.
-- Wallet-scoped policies will be added once SEP-10 session auth is wired.

-- Publisher API keys -----------------------------------------------------------
create table if not exists public.api_keys (
  id            uuid primary key default gen_random_uuid(),
  owner_wallet  text not null,
  name          text not null,
  website_url   text not null,
  key           text not null unique,
  impressions   bigint not null default 0,
  earned        numeric(14, 2) not null default 0,
  status        text not null default 'active'
                  check (status in ('active', 'inactive')),
  created_at    timestamptz not null default now()
);

create index if not exists api_keys_owner_wallet_idx
  on public.api_keys (owner_wallet);

-- Advertiser campaigns ---------------------------------------------------------
create table if not exists public.campaigns (
  id                 uuid primary key default gen_random_uuid(),
  advertiser_wallet  text not null,
  name               text not null,
  format             text not null
                       check (format in ('square', 'rectangle', 'banner', 'popup', 'rewarded')),
  description        text not null,
  image_url          text,
  status             text not null default 'active'
                       check (status in ('active', 'paused')),
  spent              numeric(14, 2) not null default 0,
  impressions        bigint not null default 0,
  created_at         timestamptz not null default now()
);

create index if not exists campaigns_advertiser_wallet_idx
  on public.campaigns (advertiser_wallet);

-- Row Level Security -----------------------------------------------------------
alter table public.api_keys  enable row level security;
alter table public.campaigns enable row level security;
