# Coopera

Plataforma independente para aproximar necessidades e possibilidades de cooperação, com privacidade contextual e segurança desde a arquitetura.

## Stack e arquitetura

- `frontend/`: React 19 + Vite, em JavaScript.
- `backend/`: Node.js + Express, organizado em rotas, controladores, serviços e repositórios.
- MySQL 8, acessado exclusivamente pela API com `mysql2`; migrations SQL versionam o esquema.
- JWT em cookie `httpOnly`, senhas com `bcryptjs`, validação com Zod e rate limiting.

## Executar localmente

Requer Node.js 20+ e Docker (ou MySQL 8 local).

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Abra `http://localhost:5173`. A API responde em `http://localhost:3001/api/health`.

O seed cria `admin@coopera.local` / `CooperaAdmin123!` apenas para desenvolvimento. Troque a senha fora do ambiente local.

## Privacidade e segurança

O feed retorna apenas pseudônimo, região e distância arredondada. Nome, e-mail, telefone e coordenadas exatas ficam separados do perfil público e nunca são enviados nas listagens. Dados de contato só podem ser compartilhados por consentimento dentro de uma cooperação aceita. Denúncias, bloqueios e eventos de segurança são persistidos; rotas sensíveis possuem limitação de requisições.

## Matching

O algoritmo inicial é determinístico: combina tipo complementar, categoria, modalidade, distância aproximada, palavras-chave, urgência e janela de disponibilidade. A pontuação explica seus próprios critérios e nunca usa popularidade ou contribuição financeira. Veja `backend/src/services/matchingService.js`.

## Voto e contribuições

O voto usa conta autenticada, chave única por usuário e hash minimizado de sinais antifraude. Uma contribuição nunca altera o voto. Pagamentos estão **desabilitados**: existe modelo e contrato de provedor, mas nenhum pagamento é criado sem credenciais e integração real. Para habilitar no futuro, implemente `PaymentProvider.createCheckout`, valide webhooks assinados e atualize contribuições apenas após confirmação do provedor.

## Comandos

```bash
npm test             # testes unitários do matching
npm run build        # build de produção do frontend
npm run db:migrate   # aplica migrations pendentes
npm run db:seed      # conteúdo público inicial e admin local
```
# Coopera
