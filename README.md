# ManifestAI

SaaS de manifestação com onboarding, autenticação, dashboard, objetivos, diário, rotinas, IA e cobrança recorrente.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (credentials)
- OpenAI API
- Stripe

## Setup local

1. Instale dependências:
```bash
npm install
```

2. Configure variáveis:
```bash
cp .env.example .env
```

3. Suba PostgreSQL (exemplo Docker):
```bash
docker run --name manifestai-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=manifestai -p 5432:5432 -d postgres:16
```

4. Gere Prisma + migre:
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Popular base (usuário demo):
```bash
npm run prisma:seed
```

6. Rodar app:
```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Quero testar agora (passo a passo)

1. Validação rápida de ambiente:
```bash
node -v
npm -v
```

2. Instalação e banco:
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

3. Subir aplicação:
```bash
npm run dev
```

4. Teste funcional manual:
- Abra `http://localhost:3000`
- Clique em **Entrar / Criar conta**
- Entre com o demo:
  - `demo@manifestai.com`
  - `12345678`
- Valide navegação para pricing, onboarding e dashboard.

5. Checks de qualidade:
```bash
npm run typecheck
npm run lint
npm run build
```

### Problemas comuns
- `next: not found`: rode `npm install` antes dos checks.
- Erro de banco/Prisma: confirme `DATABASE_URL` no `.env` e se o Postgres está ativo.

## Credenciais demo
- Email: `demo@manifestai.com`
- Senha: `12345678`

## Fluxos implementados
- Cadastro/Login com email e senha.
- Onboarding com primeiro objetivo.
- Dashboard com métricas, criação de objetivo e diário.
- Endpoints REST para goals, journal, rotina e insights.
- Geração IA para objetivo/afirmações/rotina.
- Pricing com checkout Stripe + webhook.

## Comandos úteis
```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy (próximos passos)
- Deploy web na Vercel.
- Banco PostgreSQL gerenciado (Neon/Supabase/RDS).
- Configurar webhooks Stripe no ambiente de produção.
- Rotacionar secrets e monitorar logs/erros.
