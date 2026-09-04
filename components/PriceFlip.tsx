/**
 * "142 → 76" — número concreto no topo. Frase aprovada nos criativos:
 * "Enquanto tem gente pagando 142 nessa bolsa, quem tava no grupo pagou 76."
 * Estático: "mesma bolsa, mesma loja, semana passada".
 *
 * Sem contador animado: o preço tem que ser sempre verdadeiro na tela, nunca
 * um número transitório errado.
 */
export function PriceFlip() {
  return (
    <div className="inline-flex max-w-full flex-col items-start gap-1 rounded-2xl bg-creme px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg font-semibold text-ameixa/45 line-through decoration-2">
          R$ 142
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 self-center text-coral"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
        >
          <path
            d="M4 12h15M13 6l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-display text-3xl text-framboesa">R$ 76</span>
      </div>
      <p className="text-xs font-medium text-ameixa/55">
        mesma bolsa, mesma loja, semana passada
      </p>
    </div>
  );
}
