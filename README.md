# Achados da Bia — LP de captura

Landing page de uma tela que recebe tráfego pago do Meta e leva direto pra uma
conversa no grupo do WhatsApp.

> **Atualização de 4/set/2026:** esta LP **não tem mais formulário**. O botão
> de CTA abre o WhatsApp direto — decisão consciente pra reduzir fricção e
> aumentar conversão, veio com a consequência de não existir mais lista de
> contatos própria nem evento `Lead` pareado (telefone/nome hasheados). Ver o
> amendment no topo do [`CLAUDE.md`](./CLAUDE.md) pro histórico completo dessa
> mudança e o porquê da versão anterior.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Vercel (deploy)

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev
```

O link do grupo tem um fallback fixo em [`lib/config.ts`](./lib/config.ts), então
a página funciona antes mesmo de configurar o `.env`.

## Como funciona o rastreamento

Sem formulário, não tem dado pessoal pra mandar pro Meta. O que existe:

- **Pixel** dispara `PageView` no carregamento e `Contact` no clique do CTA.
- **Conversions API** (rota [`app/api/track/route.ts`](./app/api/track/route.ts))
  manda o mesmo `Contact`, com o mesmo `event_id`, só com `fbc`/`fbp`/IP/user-agent
  — sem nome nem telefone. É mais fraco que um `Lead` pareado, mas ainda segue a
  recomendação do Meta de mandar o mesmo evento por dois caminhos (Pixel +
  servidor), que é o que sobrevive a bloqueador de anúncio e ao iOS.
- A chamada pra `/api/track` é best-effort (`fetch` com `keepalive`) e nunca
  atrasa a navegação pro WhatsApp.

## Variáveis de ambiente

| Variável | Onde | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | cliente | recomendada (tem fallback) |
| `NEXT_PUBLIC_META_PIXEL_ID` | cliente | sim, pro rastreamento |
| `META_CAPI_ACCESS_TOKEN` | **servidor, secreto** | sim, pro rastreamento |
| `META_TEST_EVENT_CODE` | servidor | só em dev |
| `META_GRAPH_API_VERSION` | servidor | opcional (padrão `v26.0`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | cliente | recomendada (LGPD / identificação do anunciante) |
| `NEXT_PUBLIC_SITE_URL` | cliente | opcional (metadados/sitemap) |

Nunca prefixe `META_CAPI_ACCESS_TOKEN` com `NEXT_PUBLIC_`.

> **CNPJ/endereço:** foram tirados do rodapé por enquanto. O Meta pode reprovar a
> campanha sem identificação do anunciante — voltar com CNPJ + endereço (ou nome +
> cidade do responsável) antes de escalar os anúncios.

## Deploy (Vercel)

1. Importe o repositório no painel da Vercel.
2. Cadastre as variáveis de ambiente da tabela acima.
3. Deploy.
4. Aponte um domínio próprio — não use `*.vercel.app` em anúncio.

## Verificação do rastreamento

Gerenciador de Eventos → Testar Eventos (com `META_TEST_EVENT_CODE`): o `Contact`
deve aparecer **uma vez só**, como "Navegador e Servidor". Se aparecer duas
vezes, a deduplicação falhou — confira o `event_id`.

## Prova social

A seção está **oculta de propósito** ([`components/SocialProof.tsx`](./components/SocialProof.tsx)).
Só ligar quando existir print real de membro. Nada de depoimento ou número
inventado.
