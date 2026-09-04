import { MARCA } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white px-5 py-10">
      <div className="mx-auto w-full max-w-lg space-y-5 text-[13px] leading-relaxed text-ameixa/65">
        <p className="font-display text-base text-ameixa">achados da bia</p>

        <p>
          <strong className="font-semibold text-ameixa/80">
            o grupo usa links de afiliado.
          </strong>{" "}
          quando você compra por um link compartilhado no grupo, a gente pode
          receber uma comissão da loja — sem custo a mais pra você. é isso que
          mantém o grupo gratuito. a Bia recomenda pelo critério, não pela
          comissão: quando não vale, ela avisa.
        </p>

        <p>
          a Bia Serra é uma personagem criada com inteligência artificial. o
          conteúdo é curadoria de ofertas reais — preços, notas e avaliações são
          de lojas de verdade e podem mudar a qualquer momento.
        </p>

        <p>
          {MARCA.responsavel} · contato:{" "}
          {MARCA.email ? (
            <a href={`mailto:${MARCA.email}`} className="underline">
              {MARCA.email}
            </a>
          ) : (
            "pelo próprio grupo do WhatsApp"
          )}
        </p>

        <p>
          <a
            href="/privacidade"
            className="font-semibold text-framboesa underline"
          >
            Política de Privacidade
          </a>
        </p>

        <p className="text-ameixa/45">
          © {new Date().getFullYear()} {MARCA.nome}. todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
