-- On-chain deposit transaction hash for the campaign budget
alter table public.campaigns
  add column if not exists tx_hash text;
