"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { OPEN_LEAD_FORM } from "./CtaButton";
import { WHATSAPP_GROUP_URL } from "@/lib/config";
import { cleanName, normalizePhone } from "@/lib/validation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | null {
  const hit = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : null;
}

function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

type Status = "idle" | "sending" | "error";

export function LeadForm() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<string>("desconhecido");
  const nomeRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (status === "sending") return;
    setOpen(false);
    setError(null);
    setStatus("idle");
  }, [status]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: string }>).detail;
      sourceRef.current = detail?.source || "desconhecido";
      setOpen(true);
    };
    window.addEventListener(OPEN_LEAD_FORM, onOpen);
    return () => window.removeEventListener(OPEN_LEAD_FORM, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => nomeRef.current?.focus(), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, close]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const nameCheck = cleanName(nome);
    if (!nameCheck.ok) {
      setError(nameCheck.reason);
      nomeRef.current?.focus();
      return;
    }
    const phoneCheck = normalizePhone(phone);
    if (!phoneCheck.ok) {
      setError(phoneCheck.reason);
      return;
    }
    if (!consent) {
      setError("Marque a caixa de consentimento pra continuar.");
      return;
    }

    setStatus("sending");

    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2);

    // Pixel: dispara Lead com o MESMO event_id que vai pro servidor
    try {
      window.fbq?.("track", "Lead", {}, { eventID: eventId });
    } catch {
      /* pixel bloqueado — a CAPI cobre */
    }

    let attr: Record<string, string> = {};
    try {
      attr = JSON.parse(sessionStorage.getItem("bia_attr") || "{}");
    } catch {
      /* noop */
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nameCheck.value,
          telefone: phoneCheck.e164Digits,
          eventId,
          fbc: readCookie("_fbc"),
          fbp: readCookie("_fbp"),
          fbclid: attr.fbclid || null,
          eventSourceUrl: window.location.href,
          consent: true,
          utm: {
            utm_source: attr.utm_source,
            utm_medium: attr.utm_medium,
            utm_campaign: attr.utm_campaign,
            utm_content: attr.utm_content,
            utm_term: attr.utm_term,
          },
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Deu um problema aqui. Tenta de novo.");
        return;
      }

      // sucesso → grupo
      window.location.href = WHATSAPP_GROUP_URL;
    } catch {
      setStatus("error");
      setError("Sem conexão. Confere a internet e tenta de novo.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="fade-in absolute inset-0 bg-ameixa/60"
      />

      <div
        ref={dialogRef}
        className="sheet-enter relative w-full max-w-md rounded-t-3xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:pb-6"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ameixa/50 transition hover:bg-black/5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <h2
          id="lead-form-title"
          className="pr-8 text-2xl leading-tight text-ameixa"
        >
          falta só isso pra você entrar
        </h2>
        <p className="mt-1.5 text-sm text-ameixa/70">
          o link do grupo abre na hora, assim que você enviar.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label htmlFor="lf-nome" className="mb-1 block text-sm font-semibold">
              seu nome
            </label>
            <input
              id="lf-nome"
              ref={nomeRef}
              type="text"
              autoComplete="given-name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="como te chamam"
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-ameixa outline-none transition focus:border-framboesa focus:ring-2 focus:ring-framboesa/25"
            />
          </div>

          <div>
            <label htmlFor="lf-tel" className="mb-1 block text-sm font-semibold">
              seu whatsapp
            </label>
            <input
              id="lf-tel"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(31) 99999-9999"
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-ameixa outline-none transition focus:border-framboesa focus:ring-2 focus:ring-framboesa/25"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-ameixa/75">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-framboesa"
            />
            <span>
              Aceito receber promoções e novidades da Bia Serra no WhatsApp e
              concordo com a{" "}
              <a
                href="/privacidade"
                target="_blank"
                className="font-semibold text-framboesa underline"
              >
                Política de Privacidade
              </a>
              .
            </span>
          </label>

          {error ? (
            <p className="rounded-lg bg-framboesa/10 px-3 py-2 text-sm font-medium text-framboesa">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-150 active:scale-[0.98] disabled:opacity-70 min-h-[56px]"
          >
            <WhatsAppIcon className="h-6 w-6 shrink-0" />
            <span>{status === "sending" ? "entrando…" : "entrar no grupo agora"}</span>
          </button>

          <p className="text-center text-[11px] text-ameixa/50">
            é de graça. seus dados servem só pra te avisar dos achados — nada de
            spam.
          </p>
        </form>
      </div>
    </div>
  );
}
