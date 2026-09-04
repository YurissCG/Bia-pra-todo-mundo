"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Revelação no scroll — leve, sem biblioteca.
 *
 * Regra de ouro: o conteúdo NUNCA fica preso invisível. O CSS só esconde
 * quando <html class="js"> (ver globals.css). Aqui a gente:
 *  - revela na hora o que já está visível no primeiro paint;
 *  - observa o resto com IntersectionObserver;
 *  - tem um timeout de segurança que revela tudo mesmo se o IO falhar.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // já visível no carregamento? revela sem animação de scroll
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(el);

    // segurança: se nada disparar em 2.5s, revela mesmo assim
    const fallback = window.setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [shown]);

  const Component = Tag as "div";

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
