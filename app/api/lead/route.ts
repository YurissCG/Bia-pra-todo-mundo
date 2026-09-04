import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { cleanName, normalizePhone, firstName } from "@/lib/validation";
import { saveLead, markCapiStatus, type LeadRecord } from "@/lib/leads";
import { sendLeadToCapi } from "@/lib/meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONSENT_TEXT =
  "Aceito receber promoções e novidades da Bia Serra no WhatsApp e concordo com a Política de Privacidade.";

type Body = {
  nome?: string;
  telefone?: string;
  eventId?: string;
  fbc?: string;
  fbp?: string;
  fbclid?: string;
  eventSourceUrl?: string;
  consent?: boolean;
  utm?: Record<string, string | undefined>;
};

// throttle best-effort por IP (só vale dentro de uma instância quente)
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 6;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

function clientIpFrom(xff: string | null, realIp: string | null): string | null {
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return realIp?.trim() || null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function POST(req: Request) {
  const h = await headers();
  const ua = h.get("user-agent");
  const ip = clientIpFrom(h.get("x-forwarded-for"), h.get("x-real-ip"));

  if (ip && rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Muitas tentativas. Espera um minuto." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // ── LGPD: sem consentimento explícito, não grava nada
  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Marque a caixa de consentimento pra continuar." },
      { status: 422 },
    );
  }

  const nameCheck = cleanName(body.nome || "");
  if (!nameCheck.ok) {
    return NextResponse.json({ ok: false, error: nameCheck.reason }, { status: 422 });
  }

  const phoneCheck = normalizePhone(body.telefone || "");
  if (!phoneCheck.ok) {
    return NextResponse.json({ ok: false, error: phoneCheck.reason }, { status: 422 });
  }

  const eventId = str(body.eventId) || crypto.randomUUID();

  // fbc/fbp: preferir o que o cliente mandou; cair pro cookie; sintetizar se possível
  const cookieStore = await cookies();
  let fbc = str(body.fbc) || cookieStore.get("_fbc")?.value || null;
  const fbp = str(body.fbp) || cookieStore.get("_fbp")?.value || null;
  const fbclid = str(body.fbclid);
  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  const nowIso = new Date().toISOString();
  const utm = body.utm || {};

  const record: LeadRecord = {
    nome: nameCheck.value,
    telefone: phoneCheck.e164Digits,
    consent: true,
    consent_text: CONSENT_TEXT,
    consent_at: nowIso,
    event_id: eventId,
    fbc,
    fbp,
    fbclid: fbclid || null,
    client_ip: ip,
    user_agent: ua || null,
    event_source_url: str(body.eventSourceUrl),
    utm_source: str(utm.utm_source),
    utm_medium: str(utm.utm_medium),
    utm_campaign: str(utm.utm_campaign),
    utm_content: str(utm.utm_content),
    utm_term: str(utm.utm_term),
  };

  // ── grava o lead ANTES de disparar o evento de otimização
  const saved = await saveLead(record);
  if (!saved.ok) {
    console.error("[lead] falha ao gravar:", saved.error);
    return NextResponse.json(
      { ok: false, error: "Não consegui salvar agora. Tenta de novo em instantes." },
      { status: 503 },
    );
  }

  // ── Conversions API: mesmo event_name + event_id do Pixel
  const capi = await sendLeadToCapi({
    eventId,
    eventTimeSeconds: Math.floor(Date.now() / 1000),
    eventSourceUrl: record.event_source_url || undefined,
    phoneDigits: phoneCheck.e164Digits,
    firstNameNormalized: firstName(nameCheck.value),
    leadId: saved.id,
    fbc: fbc || undefined,
    fbp: fbp || undefined,
    clientIp: ip || undefined,
    clientUserAgent: ua || undefined,
  });

  await markCapiStatus(saved.id, capi.ok ? "sent" : `error: ${capi.error}`.slice(0, 200));
  if (!capi.ok) console.error("[lead] CAPI falhou:", capi.error);

  // o lead já está salvo — o funil não pode travar por causa da CAPI
  return NextResponse.json({ ok: true, eventId });
}
