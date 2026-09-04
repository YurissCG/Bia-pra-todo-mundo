"use client";

import { WhatsAppIcon } from "./WhatsAppIcon";
import { WHATSAPP_GROUP_URL } from "@/lib/config";
import { fireContactEvent } from "@/lib/track";

/**
 * Vai direto pro WhatsApp — sem formulário no meio. Decisão de 4/set/2026
 * (ver amendment no topo do CLAUDE.md): prioriza conversão sobre lista
 * de contatos própria. O clique dispara `Contact` (Pixel + CAPI) antes de
 * navegar — ver lib/track.ts.
 */
export function CtaButton({
  children,
  source,
  className = "",
}: {
  children: React.ReactNode;
  source: string;
  className?: string;
}) {
  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => fireContactEvent(source)}
      className={`flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-150 ease-brand hover:brightness-105 active:scale-[0.98] ${className}`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
