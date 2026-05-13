# Life Threads

### Authors:
- Grupo 8
    - Vlad Digori 64120
    - António Silva 64174
    - Bernardo Lopes 60055
    - Matilde Couto 64118

## Descrição

Life Threads é uma aplicação onde o utilizador pode partilhar as suas memórias/sugestões com outras pessoas ou consigo mesmo. O objetivo desta aplicação é facilitar a partilha de momentos preciosos com pessoas próximas, seguidores ou desconhecidos.

## Executar o projeto
Descarregue o projeto
```bash
git clone https://github.com/glemiu6/LifeThreads.git
```


### Backend
```bash
cd LifeThreads/backend
```
Instalar as dependências necessárias
```bash
npm install
```
Inicializar o banco de dados
```bash
npx prisma init
```
Configurar o `.env`
```
DATABASE_URL="postgres://username:password@localhost:5432/db_name?schema=schema_name"


#LLM 
GEMINI_API_KEY="api_hey"
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

LLM_PROVIDER="ollama"

#Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="you_email"
EMAIL_PASS="email_app_api_key" -> 
```
>> link para obter o pass do email -> https://myaccount.google.com/apppasswords.

>> link para obter gemini api -> https://aistudio.google.com/app/apikey

Sincronize a base de dados com o seu esquema Prisma.
```bash
npx prisma migrate dev --name
```
Faça uma atualização para garantir.
```bash
npx prisma generate
```
Inicie o servidor
```bash
npx tsx watch src/server.ts
```

### Frontend

```bash
cd ../frontend
```
Instalar as dependências necessárias para o frontend

```bash
npm install
```
Iniciar o site
```bash
npm run dev
```

## Estrutura do projeto
```
├── backend
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma
│   │   ├── migrations
│   │   │   ├── 20260412000119_db
│   │   │   │   └── migration.sql
│   │   │   ├── 20260415121901_criacao_de_many_many_tables
│   │   │   │   └── migration.sql
│   │   │   ├── 20260423173944_add_password
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   ├── src
│   │   ├── controllers
│   │   │   ├── authController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── entriesController.ts
│   │   │   ├── inviteController.ts
│   │   │   ├── mediaController.ts
│   │   │   ├── membershipController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── reactionController.ts
│   │   │   ├── threadsController.ts
│   │   │   └── userController.ts
│   │   ├── docs
│   │   │   ├── components.yaml
│   │   │   ├── entries.yaml
│   │   │   ├── notification.yaml
│   │   │   ├── threads.yaml
│   │   │   └── user.yaml
│   │   ├── generated
│   │   │   └── prisma
│   │   │       ├── client.d.ts
│   │   │       ├── client.js
│   │   │       ├── default.d.ts
│   │   │       ├── default.js
│   │   │       ├── edge.d.ts
│   │   │       ├── edge.js
│   │   │       ├── index-browser.js
│   │   │       ├── index.d.ts
│   │   │       ├── index.js
│   │   │       ├── package.json
│   │   │       ├── query_compiler_fast_bg.js
│   │   │       ├── query_compiler_fast_bg.wasm
│   │   │       ├── query_compiler_fast_bg.wasm-base64.js
│   │   │       ├── runtime
│   │   │       │   ├── client.d.ts
│   │   │       │   ├── client.js
│   │   │       │   ├── index-browser.d.ts
│   │   │       │   ├── index-browser.js
│   │   │       │   └── wasm-compiler-edge.js
│   │   │       ├── schema.prisma
│   │   │       ├── wasm-edge-light-loader.mjs
│   │   │       └── wasm-worker-loader.mjs
│   │   ├── lib
│   │   │   ├── email.ts
│   │   │   ├── llm.ts
│   │   │   ├── prisma.ts
│   │   │   └── swagger.ts
│   │   ├── middleware
│   │   │   └── authGuard.ts
│   │   ├── routes
│   │   │   ├── entriesRoutes.ts
│   │   │   ├── notificationRoutes.ts
│   │   │   ├── threadsRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── schema
│   │   │   ├── aiSchema.ts
│   │   │   ├── commentSchema.ts
│   │   │   ├── entriesSchema.ts
│   │   │   ├── mediaSchema.ts
│   │   │   ├── notificationSchema.ts
│   │   │   ├── reactioonSchema.ts
│   │   │   ├── threadsSchema.ts
│   │   │   └── userSchema.ts
│   │   ├── server.ts
│   │   └── services
│   │       ├── aiService.ts
│   │       ├── commentService.ts
│   │       ├── entriesService.ts
│   │       ├── inviteService.ts
│   │       ├── mediaService.ts
│   │       ├── membershipService.ts
│   │       ├── notificationService.ts
│   │       ├── reactionService.ts
│   │       ├── tagService.ts
│   │       ├── threadsService.ts
│   │       └── userService.ts
│   └── tsconfig.json
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── api
│   │   │   └── client.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   └── layout
│   │   │       ├── Navbar.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── pages
│   │       ├── Dashboard.tsx
│   │       ├── Entries.tsx
│   │       ├── Home.tsx
│   │       ├── Login.tsx
│   │       ├── Notifications.tsx
│   │       ├── Register.tsx
│   │       ├── ThreadDetail.tsx
│   │       └── Threads.tsx
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```