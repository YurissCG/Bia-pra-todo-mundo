"use client";

import { WhatsAppIcon } from "./WhatsAppIcon";

export const OPEN_LEAD_FORM = "bia:open-lead-form";

export function openLeadForm(source: string) {
  window.dispatchEvent(new CustomEvent(OPEN_LEAD_FORM, { detail: { source } }));
}

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
    <button
      type="button"
      onClick={() => openLeadForm(source)}
      className={`flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-150 ease-brand hover:brightness-105 active:scale-[0.98] ${className}`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span>{children}</span>
    </button>
  );
}
