# Financial Control

Aplicativo completo de controle financeiro, com backend e frontend integrados, desenvolvido com tecnologias modernas para oferecer uma experiência fluida no gerenciamento de finanças pessoais.

---

## Tecnologias utilizadas

- **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL, Docker  
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query  
- **DevOps:** Docker, GitHub, Git  
- **Banco de dados:** PostgreSQL  
- **Controle de versão:** Git  

---

## Estrutura do projeto

- `finance-tracker-backend/` - API construída com NestJS que gerencia transações financeiras, processos ETL e lógica do sistema.  
- `finance-tracker-frontend/` - Aplicação web frontend feita com React, consumindo as APIs do backend e apresentando dashboards financeiros com entradas, saídas e saldo atual.

---

## Funcionalidades implementadas

- Cadastro e gerenciamento de transações (entradas e saídas financeiras)  
- Cálculo de saldo atual em tempo real  
- Interface responsiva com uso de Tailwind CSS e TanStack Query para otimização das chamadas à API  
- Estrutura para futuros módulos financeiros, investimentos, documentos, RH e imóveis  
- Configuração de ambiente Docker para backend  
- Configuração inicial do repositório Git e deploy via GitHub

---

## Como rodar o projeto localmente

### Pré-requisitos

- Node.js e npm instalados  
- Docker instalado  
- Git instalado  

### Passos para rodar

1. Clone o repositório:  
```bash
git clone https://github.com/mikaelsilvap/financial-control.git
 ```

2. Entre na pasta do backend e instale as dependências:
```bash
cd finance-tracker-backend
npm install
```

3. Configure o banco de dados PostgreSQL (ex: via Docker ou localmente) e ajuste o arquivo .env com suas credenciais.

4. Execute as migrations do Prisma:
```bash
npx prisma migrate deploy
```

5.Rode o backend:
```bash
npm run start:dev
```

6.Em outro terminal, vá para o frontend e instale as dependências:
```bash
cd ../finance-tracker-frontend
npm install
```

7.Rode o frontend:
```bash
npm run dev
```

8. Acesse http://localhost:3000 no navegador para usar a aplicação.


