# Achados da Bia — LP de captura

Landing page de uma tela que recebe tráfego pago do Meta, captura **nome e
WhatsApp**, grava o lead, dispara o evento `Lead` (Pixel + Conversions API,
deduplicado) e só então redireciona para o grupo do WhatsApp.

Contexto completo, regras de copy e de rastreamento: [`CLAUDE.md`](./CLAUDE.md).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (leads) — isolado em [`lib/leads.ts`](./lib/leads.ts)
- Vercel (deploy)

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev
```

O link do grupo tem um fallback fixo em [`lib/config.ts`](./lib/config.ts), então
a página funciona antes mesmo de configurar o `.env`. Sem Supabase configurado, o
formulário responde com erro (o lead precisa ser gravado antes do redirect).

## Variáveis de ambiente

| Variável | Onde | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | cliente | recomendada (tem fallback) |
| `NEXT_PUBLIC_META_PIXEL_ID` | cliente | sim, pro rastreamento |
| `META_CAPI_ACCESS_TOKEN` | **servidor, secreto** | sim, pro rastreamento |
| `META_TEST_EVENT_CODE` | servidor | só em dev |
| `META_GRAPH_API_VERSION` | servidor | opcional (padrão `v21.0`) |
| `NEXT_PUBLIC_SUPABASE_URL` | cliente | sim |
| `SUPABASE_SERVICE_ROLE_KEY` | **servidor, secreto** | sim |
| `NEXT_PUBLIC_SITE_URL` | cliente | opcional (metadados/sitemap) |

Nunca prefixe `META_CAPI_ACCESS_TOKEN` ou `SUPABASE_SERVICE_ROLE_KEY` com
`NEXT_PUBLIC_`.

## Banco (Supabase)

Rode uma vez, no SQL Editor: [`supabase/schema.sql`](./supabase/schema.sql).

## Deploy (Vercel)

1. Importe o repositório no painel da Vercel.
2. Cadastre todas as variáveis de ambiente.
3. Deploy.
4. Aponte um domínio próprio — não use `*.vercel.app` em anúncio.

## Verificação do rastreamento

Gerenciador de Eventos → Testar Eventos (com `META_TEST_EVENT_CODE`): o `Lead`
deve aparecer **uma vez só**, como "Navegador e Servidor". Se aparecer duas
vezes, a deduplicação falhou — confira o `event_id`.

## Prova social

A seção está **oculta de propósito** ([`components/SocialProof.tsx`](./components/SocialProof.tsx)).
Só ligar quando existir print real de membro. Nada de depoimento ou número
inventado.
