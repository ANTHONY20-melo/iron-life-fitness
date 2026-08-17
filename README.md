# 🏋️ Iron Life Fitness

Sistema completo de gerenciamento para academias — site institucional, área do aluno, painel administrativo, API REST, banco de dados relacional e aplicativo mobile.

---

## ✨ Funcionalidades

### 🌐 Site Institucional
- Landing page responsiva com design dark profissional
- Seção de planos com preços e features detalhadas
- FAQ interativo (perguntas frequentes)
- Formulário de contato
- Navegação suave entre seções
- Animações de entrada (fade-in, slide)

### 🏠 Área do Aluno
- **Dashboard** — visão geral com treino do dia, pagamentos, conquistas e resumo de atividades
- **Treinos** — lista de treinos atribuídos com detalhes de exercícios, séries, repetições e descanso
- **Cronômetro** — timer integrado para controle de tempo de treino e descanso entre séries
- **Histórico** — registro completo de todas as sessões de treino realizadas
- **Evolução** — gráficos de progresso de peso, % gordura, massa muscular e medidas corporais
- **Avaliações** — histórico de avaliações físicas com comparação entre períodos
- **Agenda** — gerenciamento de compromissos com professor (avaliação física, personal training, consultas)
- **Pagamentos** — visualização de faturas, status de pagamento e comprovantes
- **Gamificação** — sistema de pontos, níveis, conquistas desbloqueadas e ranking mensal
- **Perfil** — edição de dados pessoais, foto e informações físicas
- **Check-in** — registro de presença via QR Code ou código do aluno

### 🎛️ Painel Administrativo
- **Dashboard Admin** — métricas gerais: total de alunos, receita, check-ins, novos cadastros
- **Gerenciamento de Alunos** — CRUD completo com busca, filtros e detalhes
- **Gerenciamento de Professores** — CRUD com especialidade, CREF e status
- **Gerenciamento de Treinos** — criação e edição de treinos com exercícios
- **Gerenciamento de Exercícios** — biblioteca de exercícios por grupo muscular
- **Gerenciamento de Planos** — criação de planos com preço, duração e features
- **Gerenciamento de Pagamentos** — registro, atualização e marcação de pagamentos
- **Check-in QR Code** — geração e leitura de QR Code para check-in
- **Avaliações Físicas** — registro de medidas corporais e composição corporal
- **Agenda/Administração** — visão administrativa de agendamentos
- **Configurações** — configurações gerais do sistema

### 🔌 API REST
- **15+ módulos** de endpoints organizados por domínio
- Autenticação JWT com Refresh Token
- Controle de acesso baseado em funções (RBAC): Admin, Professor, Aluno
- Validação de entrada com Zod
- Documentação Swagger/OpenAPI interativa
- Rate limiting para proteção contra abuso
- CORS configurável
- Tratamento centralizado de erros

### 🗄️ Banco de Dados
- **25+ tabelas** com relacionamentos completos
- Índices otimizados para consultas frequentes
- Enums para tipos, status e categorias
- Suporte a múltiplas unidades (academias)
- Migrations versionadas via Prisma

### 📱 Mobile (React Native + Expo)
- App nativo para Android e iOS
- Compartilha a mesma API REST do backend
- Experiência mobile nativa com navegação por abas
- Check-in via QR Code com câmera
- Notificações push (planejado)

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend Web | React + TypeScript + Vite | 18 / 6 |
| UI | Tailwind CSS | v4 |
| Estado Global | Zustand | 5 |
| Gráficos | Recharts | 2 |
| Ícones | Lucide React | — |
| Rotas | React Router DOM | 6 |
| Backend | Node.js + TypeScript + Express | 20 / 4 |
| ORM | Prisma | 6 |
| Banco de Dados | PostgreSQL | 16 |
| Autenticação | JWT + Refresh Token + bcryptjs | — |
| Validação | Zod | 3 |
| Segurança | Helmet + express-rate-limit | — |
| Documentação | Swagger (swagger-jsdoc + swagger-ui-express) | — |
| QR Code | qrcode | — |
| Mobile | React Native + Expo | — |
| Containerização | Docker + Docker Compose | — |
| Build Frontend | Vite | 6 |
| Build Backend | TypeScript Compiler (tsc) | 5 |

---

## 📁 Estrutura do Projeto

```
iron-life-fitness/
├── backend/                    # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco de dados
│   │   ├── seed.ts             # Script de popular dados de teste
│   │   └── seeds/              # Dados seed organizados
│   ├── src/
│   │   ├── config/             # Configurações (env, JWT, etc.)
│   │   ├── controllers/        # Controllers (lógica de negócio)
│   │   ├── middlewares/        # Auth, error handler, RBAC
│   │   ├── models/             # Interfaces e tipos
│   │   ├── routes/             # Rotas da API (16 arquivos)
│   │   ├── services/           # Services (acesso ao banco)
│   │   ├── utils/              # Utilitários (hash, token, etc.)
│   │   ├── validators/         # Validações Zod
│   │   └── server.ts           # Entry point do servidor
│   ├── tests/                  # Testes unitários
│   ├── Dockerfile              # Build multi-stage
│   ├── package.json
│   └── tsconfig.json
├── web/                        # Frontend React (Site + Admin + Área do Aluno)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── public/         # Home, Login, Register, NotFound
│   │   │   ├── admin/          # 12 páginas administrativas
│   │   │   └── student/        # 10 páginas do aluno
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── hooks/              # Custom hooks
│   │   ├── stores/             # Zustand stores
│   │   ├── services/           # Cliente API (axios)
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilitários
│   │   ├── App.tsx             # Router principal
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Assets estáticos
│   ├── nginx.conf              # Configuração nginx (Docker)
│   ├── Dockerfile              # Build multi-stage
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── mobile/                     # App React Native (Expo)
│   └── src/
│       ├── components/
│       ├── navigation/
│       ├── screens/
│       ├── services/
│       ├── stores/
│       ├── types/
│       └── utils/
├── database/                   # Scripts SQL auxiliares
├── docker/                     # Configurações Docker adicionais
├── docs/                       # Documentação do projeto
├── docker-compose.yml          # Orquestração Docker
├── .dockerignore
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Instalação

### Pré-requisitos

| Ferramenta | Versão Mínima | Versão Recomendada |
|-----------|--------------|-------------------|
| Node.js | 18+ | 20 LTS |
| npm | 8+ | 10+ |
| PostgreSQL | 14+ | 16 |
| Git | 2.30+ | Mais recente |
| Docker | 20+ (opcional) | Mais recente |
| Docker Compose | 2+ (opcional) | Mais recente |
| Expo CLI | — (mobile) | Mais recente |

### Opção 1: Docker (Recomendado)

O método mais rápido para ter tudo rodando. Requer Docker e Docker Compose instalados.

```bash
# Clonar o repositório
git clone https://github.com/ANTHONY20-melo/iron-life-fitness.git
cd iron-life-fitness

# Iniciar todos os serviços
docker compose up -d

# Verificar se os containers estão rodando
docker compose ps

# Acessar:
#   Frontend:       http://localhost:5173
#   Backend API:    http://localhost:3340
#   Swagger Docs:   http://localhost:3340/api-docs
```

Para popular o banco com dados de teste:

```bash
# Entrar no container do backend
docker compose exec backend sh

# Rodar o seed
npx prisma db seed

# Sair
exit
```

### Opção 2: Setup Manual

#### Backend

```bash
# Entrar na pasta do backend
cd backend

# Copiar variáveis de ambiente
cp .env.example .env

# Instalar dependências
npm install

# Gerar o Prisma Client
npx prisma generate

# Aplicar o schema no banco (cria tabelas)
npx prisma db push

# Popular com dados de teste (opcional)
npm run db:seed

# Iniciar em modo desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3340`.

#### Frontend (em outro terminal)

```bash
# Entrar na pasta do frontend
cd web

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### Banco de Dados

```bash
# Gerar Prisma Client (após alterar schema.prisma)
npx prisma generate

# Aplicar schema no banco (sincroniza tabelas)
npx prisma db push

# Criar migration versionada
npx prisma migrate dev --name nome-da-migracao

# Popular com dados de teste
npm run db:seed

# Resetar banco (apaga tudo e recria)
npx prisma migrate reset --force

# Abrir Prisma Studio (GUI para explorar dados)
npx prisma studio
```

---

## 🔧 Configuração

### Variáveis de Ambiente (.env)

Copie o `.env.example` para `.env` na pasta `backend/` e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Descrição | Padão | Obrigatória |
|----------|-----------|-------|-------------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://postgres:postgres@localhost:5432/iron_life_fitness?schema=public` | ✅ |
| `JWT_SECRET` | Segredo para assinatura dos tokens de acesso | — | ✅ |
| `JWT_REFRESH_SECRET` | Segredo para assinatura dos refresh tokens | — | ✅ |
| `JWT_EXPIRES_IN` | Tempo de expiração do token de acesso | `15m` | ❌ |
| `JWT_REFRESH_EXPIRES_IN` | Tempo de expiração do refresh token | `7d` | ❌ |
| `PORT` | Porta do servidor backend | `3340` | ❌ |
| `NODE_ENV` | Ambiente (`development` ou `production`) | `development` | ❌ |
| `CORS_ORIGIN` | Origem permitida pelo CORS | `http://localhost:5173` | ❌ |

> ⚠️ **Segurança:** Nunca versione o arquivo `.env` com valores reais de produção. Use variáveis de ambiente no Docker Compose ou no provedor de deploy.

---

## 👥 Usuários de Teste

Após rodar `npm run db:seed`, os seguintes usuários ficam disponíveis:

| Função | Email | Senha | Permissões |
|--------|-------|-------|-----------|
| Administrador | admin@ironlife.com | admin123 | Acesso total ao sistema, gerenciamento de todos os módulos |
| Professor | trainer1@ironlife.com | trainer123 | Gerenciar treinos, exercícios, avaliações e alunos vinculados |
| Aluno | student1@ironlife.com | student123 | Área do aluno, treinos, histórico, pagamentos, conquistas |

---

## 📡 API

A API REST segue o padrão RESTful com rotas organizadas por domínio. Todas as rotas exceto autenticação exigem token JWT no header `Authorization: Bearer <token>`.

### 🔐 Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login (retorna access + refresh token) | Não |
| POST | `/api/auth/register` | Cadastro de novo aluno | Não |
| POST | `/api/auth/refresh` | Renovar token de acesso | Refresh Token |
| POST | `/api/auth/logout` | Revogar refresh token | Sim |

### 👤 Alunos

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/students` | Listar todos os alunos | Admin, Professor |
| GET | `/api/students/profile` | Meu perfil (aluno logado) | Aluno |
| GET | `/api/students/:id` | Detalhes de um aluno | Admin, Professor |
| POST | `/api/students` | Criar novo aluno | Admin |
| PUT | `/api/students/:id` | Atualizar aluno | Admin |
| DELETE | `/api/students/:id` | Excluir aluno | Admin |

### 🏋️ Professores

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/trainers` | Listar todos os professores | Admin |
| GET | `/api/trainers/:id` | Detalhes de um professor | Admin |
| POST | `/api/trainers` | Criar novo professor | Admin |
| PUT | `/api/trainers/:id` | Atualizar professor | Admin |
| DELETE | `/api/trainers/:id` | Excluir professor | Admin |

### 💪 Treinos

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/workouts` | Listar treinos | Todos autenticados |
| GET | `/api/workouts/:id` | Detalhes de um treino | Todos autenticados |
| POST | `/api/workouts` | Criar treino | Admin, Professor |
| PUT | `/api/workouts/:id` | Editar treino | Admin, Professor |
| DELETE | `/api/workouts/:id` | Excluir treino | Admin, Professor |
| POST | `/api/workouts/:id/assign/:studentId` | Atribuir treino ao aluno | Admin, Professor |
| POST | `/api/workouts/sessions/:sessionId/complete-exercise` | Concluir exercício na sessão | Aluno |
| POST | `/api/workouts/sessions/:sessionId/complete` | Concluir sessão de treino | Aluno |

### 🏃 Exercícios

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/exercises` | Listar exercícios | Todos autenticados |
| GET | `/api/exercises/:id` | Detalhes de um exercício | Todos autenticados |
| POST | `/api/exercises` | Criar exercício | Admin, Professor |
| PUT | `/api/exercises/:id` | Atualizar exercício | Admin, Professor |
| DELETE | `/api/exercises/:id` | Excluir exercício | Admin |

### 📊 Avaliações Físicas

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| POST | `/api/evaluations` | Criar avaliação física | Admin, Professor |
| GET | `/api/evaluations/student/:studentId` | Avaliações de um aluno | Admin, Professor, Aluno (próprio) |

### ✅ Check-in

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| POST | `/api/checkins` | Realizar check-in | Aluno |
| POST | `/api/checkins/qr` | Check-in via QR Code | Aluno |
| GET | `/api/checkins/history` | Histórico de check-ins | Admin, Professor, Aluno (próprio) |

### 💳 Pagamentos

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/payments` | Listar pagamentos | Admin, Professor, Aluno (próprios) |
| POST | `/api/payments` | Criar pagamento | Admin |
| PUT | `/api/payments/:id/paid` | Marcar como pago | Admin |

### 📋 Planos

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/plans` | Listar planos | Admin |
| GET | `/api/plans/:id` | Detalhes de um plano | Admin |
| POST | `/api/plans` | Criar plano | Admin |
| PUT | `/api/plans/:id` | Atualizar plano | Admin |
| DELETE | `/api/plans/:id` | Excluir plano | Admin |

### 🔔 Notificações

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/notifications` | Minhas notificações | Todos autenticados |
| GET | `/api/notifications/unread-count` | Contagem de não lidas | Todos autenticados |
| POST | `/api/notifications/:id/read` | Marcar como lida | Todos autenticados |
| POST | `/api/notifications/read-all` | Marcar todas como lidas | Todos autenticados |

### 🏆 Conquistas e Ranking

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/achievements` | Todas as conquistas disponíveis | Todos autenticados |
| GET | `/api/achievements/student/:studentId` | Conquistas desbloqueadas | Todos autenticados |
| GET | `/api/rankings/leaderboard` | Ranking mensal | Todos autenticados |

### 📈 Dashboard Admin

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/dashboard/stats` | Estatísticas gerais do sistema | Admin |

### 🏢 Unidades

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/units` | Listar unidades | Admin |
| POST | `/api/units` | Criar unidade | Admin |
| PUT | `/api/units/:id` | Atualizar unidade | Admin |

### 📅 Agenda

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|----------|
| GET | `/api/appointments` | Listar agendamentos | Admin, Professor, Aluno (próprios) |
| POST | `/api/appointments` | Criar agendamento | Admin, Professor |
| PUT | `/api/appointments/:id` | Atualizar agendamento | Admin, Professor |
| DELETE | `/api/appointments/:id` | Cancelar agendamento | Admin |

### 📖 Documentação Swagger

Acesse `http://localhost:3340/api-docs` para a documentação interativa completa da API com todos os endpoints, schemas e exemplos de request/response.

---

## 🎨 Design System

O Iron Life Fitness usa um design **dark mode** profissional com identidade visual forte:

### Paleta de Cores

| Elemento | Cor | Código |
|----------|-----|--------|
| Fundo principal | Preto | `#0a0a0a` |
| Fundo secundário | Cinza escuro | `#111111` |
| Cards e superfícies | Cinza médio | `#1a1a1a` |
| Bordas | Cinza sutil | `#2a2a2a` |
| Destaque / Accent | Vermelho | `#DC2626` |
| Texto principal | Branco | `#ffffff` |
| Texto secundário | Cinza claro | `#a1a1aa` |
| Sucesso | Verde | `#22c55e` |
| Alerta | Amarelo | `#eab308` |
| Erro | Vermelho | `#ef4444` |

### Tipografia

- **Títulos:** font-weight bold (700+), tamanhos progressivos (text-2xl a text-4xl)
- **Corpo:** font-weight regular (400), line-height confortável
- **Labels:** font-weight semibold (600), tamanhos menores
- **Badges:** uppercase, font-size pequeno, letter-spacing amplo

### Componentes

- **Cards:** `rounded-xl`, borda `border border-[#2a2a2a]`, fundo `bg-[#1a1a1a]`
- **Botões:** fundo vermelho `bg-red-600`, hover `hover:bg-red-700`, transições suaves
- **Inputs:** fundo escuro, borda sutil, focus ring vermelho
- **Tabelas:** bordas separadoras, hover nas linhas, responsivas
- **Badges:** fundo com opacidade, borda colorida, texto colorido
- **Modals:** overlay escuro com blur, card centralizado com animação

### Animações

- `fade-in` — entrada suave de elementos
- `slide-up` — elementos surgindo de baixo
- `hover transitions` — mudanças graduais em hover
- `progress bars` — barras de progresso animadas
- `scale on hover` — botões e cards com efeito de escala

---

## 📱 Mobile

O aplicativo mobile é construído com **React Native + Expo** e compartilha a mesma API REST do backend.

### Estrutura

```
mobile/src/
├── components/     # Componentes reutilizáveis
├── navigation/     # Navegação por abas e stacks
├── screens/        # Telas do app
├── services/       # Cliente API
├── stores/         # Zustand stores
├── types/          # TypeScript types
└── utils/          # Utilitários
```

### Setup

```bash
cd mobile

# Instalar dependências
npm install

# Iniciar o Expo
npx expo start

# Opções:
#   a = Android (Expo Go)
#   i = iOS (Expo Go)
#   w = Web
```

Escaneie o QR Code com:
- **Android:** Expo Go (Google Play)
- **iOS:** Câmera nativa (redireciona para Expo Go)

### Funcionalidades Mobile

- Tela de login e registro
- Dashboard do aluno
- Lista de treinos com detalhes
- Cronômetro de treino
- Histórico de sessões
- Check-in via QR Code (câmera)
- Notificações
- Perfil do aluno

---

## 🧪 Testes

### Backend

```bash
cd backend

# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch
```

Os testes usam **Vitest** e cobrem controllers, services, middlewares e validadores.

### Frontend

```bash
cd web

# (Testes serão adicionados em breve)
npm test
```

### Cobertura

```
backend/
└── tests/
    ├── controllers/    # Testes dos controllers
    ├── services/       # Testes dos services
    ├── middlewares/    # Testes dos middlewares
    └── utils/          # Testes dos utilitários
```

---

## 🐳 Docker

### Comandos Essenciais

```bash
# Iniciar todos os serviços em background
docker compose up -d

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f web
docker compose logs -f postgres

# Parar todos os serviços
docker compose down

# Parar e apagar volumes (remove dados do banco)
docker compose down -v

# Rebuild após alterações no código
docker compose up -d --build

# Ver status dos containers
docker compose ps

# Entrar no container do backend
docker compose exec backend sh

# Entrar no container do banco
docker compose exec postgres psql -U postgres -d iron_life_fitness
```

### Arquitetura Docker

```
┌─────────────────────────────────────────────────┐
│                  Docker Network                  │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   web    │  │ backend  │  │   postgres   │  │
│  │ (nginx)  │──│ (Node)   │──│ (PostgreSQL) │  │
│  │  :5173   │  │  :3340   │  │    :5432     │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                  │
│  Portas expostas:                                │
│    5173 → Frontend (nginx serve SPA + proxy API) │
│    3340 → Backend API (acessível diretamente)    │
│    5432 → PostgreSQL (acessível para debugging)  │
└─────────────────────────────────────────────────┘
```

- **web** (nginx): serve o SPA built e faz proxy reverso de `/api` para o backend
- **backend** (Node.js): API REST com Express, Prisma e todas as rotas
- **postgres** (PostgreSQL 16): banco de dados relacional com volume persistente

### Ambientes

| Ambiente | Comando | Descrição |
|----------|---------|-----------|
| Desenvolvimento | `docker compose up -d` | Sobe todos os serviços |
| Produção | `docker compose -f docker-compose.yml up -d` | Mesmo compose, variáveis de ambiente ajustadas |
| Limpeza | `docker compose down -v` | Remove containers e dados |

---

## 📋 Roadmap

### ✅ Concluído

- [x] Backend API completa (15+ módulos)
- [x] Frontend web (Site Institucional + Admin + Área do Aluno)
- [x] Banco de dados relacional (25+ tabelas)
- [x] Autenticação JWT com Refresh Token
- [x] Controle de acesso (RBAC: Admin/Professor/Aluno)
- [x] Sistema de check-in com QR Code
- [x] Gamificação (pontos, níveis, conquistas, ranking)
- [x] Sistema de notificações
- [x] Docker Compose com multi-stage builds
- [x] Documentação Swagger/OpenAPI
- [x] Validação com Zod em todas as rotas
- [x] Rate limiting e Helmet para segurança
- [x] Prisma ORM com schema completo
- [x] Seed de dados de teste

### 🔜 Em Progresso

- [ ] App mobile completo (React Native + Expo)
- [ ] Testes E2E (Playwright/Cypress)

### 📌 Planejado

- [ ] Integração pagamento (PIX/Cartão via Mercado Pago/Stripe)
- [ ] Push notifications (FCM/APNs)
- [ ] Relatórios em PDF (avaliações, pagamentos, treinos)
- [ ] Multi-unidade completo (gestão de filiais)
- [ ] Dashboard de relatórios avançados (gráficos, exportação)
- [ ] Sistema de prescrição de treinos por IA
- [ ] Integração com wearables (Apple Watch, Fitbit)
- [ ] Sistema de aulas em grupo/agendamento
- [ ] Chat entre aluno e professor
- [ ] Backup automático do banco de dados

---

## 🔒 Segurança

- **JWT com Refresh Token** — tokens de curta duração (15min) renovados via refresh token (7 dias)
- **bcryptjs** — senhas hasheadas com salt rounds
- **RBAC** — controle de acesso por função (Admin > Professor > Aluno)
- **Helmet** — headers de segurança HTTP habilitados
- **Rate Limiting** — proteção contra brute force e abuso de API
- **Validação Zod** — todas as entradas validadas antes de processar
- **CORS configurável** — apenas origens autorizadas
- **SQL Injection** — prevenido pelo Prisma ORM (parameterized queries)
- **XSS** — prevenido pelo React (escape automático de JSX) + Helmet

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <strong>🏋️ Iron Life Fitness</strong><br>
  <em>Sistema completo de gerenciamento para academias</em><br><br>
  Desenvolvido com ❤️ por <a href="https://github.com/ANTHONY20-melo">Anthony Melo</a>
</p>
