-- Tabela de leads da LP da Bia Serra.
-- Rodar no SQL Editor do Supabase (uma vez).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  nome              text not null,
  telefone          text not null,           -- normalizado: 55 + DDD + número, só dígitos

  -- LGPD: consentimento com carimbo de data/hora
  consent           boolean not null default false,
  consent_text      text,
  consent_at        timestamptz not null,

  -- rastreamento Meta
  event_id          text,
  fbc               text,
  fbp               text,
  fbclid            text,
  client_ip         text,
  user_agent        text,
  event_source_url  text,

  -- atribuição
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,

  -- resultado do envio pra Conversions API
  capi_status       text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_telefone_idx  on public.leads (telefone);

-- RLS ligado: só a service_role (usada no servidor) escreve/lê.
alter table public.leads enable row level security;

-- Sem policy pública: anon/authenticated não acessam nada.
-- A service_role key ignora RLS por padrão, então o Route Handler continua gravando.
