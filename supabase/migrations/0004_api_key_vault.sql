-- Per-API-key vault contract address (deployed by the publisher's wallet)
alter table public.api_keys
  add column if not exists vault_contract_id text;
