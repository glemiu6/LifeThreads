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
Instalar as dependências necessárias
```bash
npm install
```
Inicializar o banco de dados
```bash
npx prisma init
```
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

## Estrutura do projeto
```
├── package-lock.json
├── package.json
├── prisma  
│   └── schema.prisma
├── prisma.config.ts
├── src/
├── controllers
│   ├── authController.ts
│   ├── entriesController.ts
│   ├── notificationController.ts
│   ├── threadsController.ts
│   └── userController.ts
├── docs
│   ├── components.yaml
│   ├── entries.yaml
│   ├── notification.yaml
│   ├── threads.yaml
│   └── user.yaml
├── generated
│   └── prisma
├── lib
│   ├── prisma.ts
│   └── swagger.ts
├── middleware
│   └── authGuard.ts
├── routes
│   ├── entriesRoutes.ts
│   ├── notificationRoutes.ts
│   ├── threadsRoutes.ts
│   └── userRoutes.ts
├── schema
│   ├── entriesSchema.ts
│   ├── notificationSchema.ts
│   ├── threadsSchema.ts
│   └── userSchema.ts
├── server.ts
└── services
    ├── entriesService.ts
    ├── notificationService.ts
    ├── threadsService.ts
    └── userService.ts
├── test.http
└── tsconfig.json
```