import { Reveal } from "./Reveal";

const steps = [
  {
    n: "1",
    titulo: "entra",
    texto:
      "clica no botão e o link do grupo abre direto no seu whatsapp. sem cadastro.",
  },
  {
    n: "2",
    titulo: "recebe",
    texto:
      "todo dia o achado que passou no filtro: nota alta, muitas vendas e o que olhar antes de comprar.",
  },
  {
    n: "3",
    titulo: "economiza",
    texto:
      "enquanto tem gente pagando 142 numa bolsa, quem tava no grupo pagou 76. e quando não vale, a Bia também avisa.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-creme px-5 py-14">
      <div className="mx-auto w-full max-w-lg">
        <Reveal>
          <h2 className="text-[2rem] leading-tight text-ameixa sm:text-4xl">
            como funciona
          </h2>
        </Reveal>

        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 70}>
              <div className="flex gap-4 rounded-2xl bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-framboesa font-display text-lg text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl text-ameixa">{s.titulo}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-ameixa/75">
                    {s.texto}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
