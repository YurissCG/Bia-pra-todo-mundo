import { Reveal } from "./Reveal";

/**
 * PROVA SOCIAL — OCULTA DE PROPÓSITO.
 *
 * Regra do CLAUDE.md: esta seção só entra no ar quando existir print REAL de
 * membro do grupo. Nada de depoimento inventado, nada de número inventado.
 * Contagem de membros só aparece quando for real e puxada do banco.
 *
 * Quando tiver prints de verdade:
 *   1. coloque as imagens em /public/prova/*.jpg
 *   2. preencha PRINTS abaixo
 *   3. troque ENABLED para true
 *   4. renderize <SocialProof /> no app/page.tsx (entre HowItWorks e o CTA 3)
 */
const ENABLED = false;

type Print = { src: string; alt: string };
const PRINTS: Print[] = [];

export function SocialProof() {
  if (!ENABLED || PRINTS.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-lg px-5 py-14">
      <Reveal>
        <h2 className="text-[2rem] leading-tight text-ameixa sm:text-4xl">
          o grupo por dentro
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {PRINTS.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            className="w-full rounded-xl border border-black/5"
          />
        ))}
      </div>
    </section>
  );
}
