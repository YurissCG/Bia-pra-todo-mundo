/**
 * Único arquivo que sabe ONDE o lead é gravado.
 * Trocar Supabase por outro destino? Só mexe aqui.
 *
 * Schema esperado: ver supabase/schema.sql
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type LeadRecord = {
  nome: string;
  /** normalizado: dígitos com prefixo 55 */
  telefone: string;
  consent: boolean;
  consent_text: string;
  consent_at: string; // ISO
  event_id: string;
  fbc: string | null;
  fbp: string | null;
  fbclid: string | null;
  client_ip: string | null;
  user_agent: string | null;
  event_source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function saveLead(lead: LeadRecord): Promise<SaveResult> {
  const supabase = getClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id as string };
}

/**
 * Atualiza o status do envio pra Conversions API, pra dar pra auditar
 * depois qual lead pareou e qual não.
 */
export async function markCapiStatus(id: string, status: string): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;
  await supabase.from("leads").update({ capi_status: status }).eq("id", id);
}
