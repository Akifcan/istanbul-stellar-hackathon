-- Campaign budget + targeting fields
alter table public.campaigns
  add column if not exists budget          numeric(14, 2) not null default 0,
  add column if not exists audiences       text[] not null default '{}',
  add column if not exists estimated_reach bigint not null default 0;
