# Contributing to ZFlow

First off, **thank you** for considering contributing to ZFlow! 🎉

This document provides guidelines and information to help you contribute effectively. Every contribution matters, whether it's fixing a typo, reporting a bug, suggesting a feature, or submitting a pull request.

---

## 📋 Table of Contents


- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Areas Open for Contribution](#-areas-open-for-contribution)

---



## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, check if the issue already exists. If it doesn't, create a new issue with the **Bug Report** template and include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs. **actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots or logs** (if applicable)

### 💡 Suggesting Features

Feature suggestions are welcome! Please open an issue with the **Feature Request** template and include:

- **Problem statement** — What problem does this solve?
- **Proposed solution** — How would you implement it?
- **Alternatives considered** — Any other approaches?
- **Additional context** — Mockups, examples, etc.



## 🛠️ Development Setup

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **pnpm** v10+ (`npm install -g pnpm`)
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **Apache Kafka** ([Download](https://kafka.apache.org/) or use Docker)
- **Git** ([Download](https://git-scm.com/))

### Step-by-Step Setup

#### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/ZFlow.git
cd ZFlow

# Add upstream remote
git remote add upstream https://github.com/Rishi713144/ZFlow.git
```

#### 2. Create Environment Files

Each service needs its own `.env` file. Use the provided `.env.example` files:

```bash
cp primary-backend/.env.example primary-backend/.env
cp hooks/.env.example hooks/.env
cp processor/.env.example processor/.env
cp worker/.env.example worker/.env
```

> 🔒 **Never commit `.env` files.** They contain sensitive credentials and are listed in `.gitignore`.

Fill in the required values. At minimum, you need:
- A PostgreSQL `DATABASE_URL` for all services
- A `JWT_PASSWORD` for the primary backend

For the worker service, email and Solana features require additional credentials (SMTP, Solana private key). These can be left empty during local development if you don't need those features.

#### 3. Install Dependencies

```bash
# Root
pnpm install

# Each service
cd primary-backend && pnpm install && cd ..
cd hooks && pnpm install && cd ..
cd processor && pnpm install && cd ..
cd worker && pnpm install && cd ..
cd frontend && pnpm install && cd ..
```

#### 4. Set Up the Database

```bash
cd primary-backend

# Apply all migrations
npx prisma migrate deploy

# Seed initial data (available triggers & actions)
npx prisma db seed

cd ..
```

#### 5. Start Kafka (via Docker)

```bash
docker run -d --name zookeeper -p 2181:2181 wurstmeister/zookeeper
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  wurstmeister/kafka
```

#### 6. Start All Services

```bash
# In separate terminals:
cd primary-backend && pnpm dev    # Port 3001
cd hooks && pnpm dev              # Port 3002
cd processor && pnpm dev
cd worker && pnpm dev
cd frontend && pnpm dev           # Port 3000
```

#### 7. Verify Everything Works

- Frontend: http://localhost:3000
- API Health: http://localhost:3001/api/v1/trigger/available
- Hooks: http://localhost:3002 (POST to `/hooks/catch/:userId/:zapId`)

---

## 📁 Project Structure

Understanding the project structure will help you navigate the codebase:

```
ZFlow/
├── frontend/                 # Next.js web application
│   ├── app/                  # App router (pages, layout, config)
│   │   ├── config.ts         # API endpoint configuration
│   │   ├── dashboard/        # Dashboard page
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── zap/              # Zap creation page
│   └── components/           # Reusable React components
│
├── primary-backend/          # Main REST API
│   ├── prisma/               # Schema, migrations, seed data
│   │   ├── schema.prisma     # 🔑 Database schema definition
│   │   └── seed.ts           # Initial data seeding
│   └── src/
│       ├── config.ts         # Environment configuration
│       ├── db/index.ts       # Prisma client instance
│       ├── middleware.ts      # JWT auth middleware
│       ├── types/index.ts    # Zod validation schemas
│       └── router/           # Express route handlers
│           ├── user.ts       # Auth routes (signup/signin)
│           ├── zap.ts        # Zap CRUD routes
│           ├── trigger.ts    # Available triggers
│           └── action.ts     # Available actions
│
├── hooks/                    # Webhook receiver
│   └── src/index.ts          # Express server for incoming webhooks
│
├── processor/                # Outbox → Kafka bridge
│   └── src/index.ts          # Polls DB outbox, publishes to Kafka
│
├── worker/                   # Event consumer & executor
│   └── src/
│       ├── index.ts          # Kafka consumer, action dispatcher
│       ├── email.ts          # Nodemailer email sender
│       ├── solana.ts         # Solana SOL transfer
│       └── parser.ts         # Template variable parser
│
├── .github/                  # GitHub templates & workflows
│   ├── ISSUE_TEMPLATE/       # Bug report & feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
│
├── CONTRIBUTING.md           # ← You are here

├── LICENSE                   # MIT License
└── README.md                 # Project overview & setup
```

---

## 📐 Coding Guidelines

### General Rules

- Write **TypeScript** for all backend services
- Use **Zod** for input validation on API endpoints
- Use **Prisma** for all database operations — no raw SQL
- Follow existing patterns in the codebase
- Keep functions small and focused
- Add comments for complex logic

### TypeScript

- Use strict type checking — avoid `any` where possible
- Use descriptive variable and function names
- Export types from dedicated files in `types/` directories

### Frontend

- Use **Next.js App Router** conventions
- Use **Tailwind CSS** for styling — avoid inline styles
- Keep components small and composable
- Place shared components in `components/`
- API configuration goes in `app/config.ts`

### Backend

- Organize routes in `router/` directory
- Use middleware for cross-cutting concerns (auth, validation)
- Return consistent JSON response shapes:
  ```json
  // Success
  { "data": { ... } }
  
  // Error
  { "message": "Human-readable error message" }
  ```
- Use appropriate HTTP status codes

### Database

- All schema changes go through a **Prisma migration**:
  ```bash
  cd primary-backend
  npx prisma migrate dev --name descriptive_migration_name
  ```
- Never modify existing migration files
- Add seed data for new features in `prisma/seed.ts`

### Environment Variables

- **Never hardcode secrets** — always use `process.env`
- Add new variables to the appropriate `.env.example` file
- Document new variables in the README.
- Validate required env vars at startup

---


### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                                    |
| ---------- | ---------------------------------------------- |
| `feat`     | A new feature                                  |
| `fix`      | A bug fix                                      |
| `docs`     | Documentation only changes                     |
| `style`    | Code style changes (formatting, semicolons)    |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvements                       |
| `test`     | Adding or updating tests                       |
| `chore`    | Maintenance tasks (deps, CI, configs)          |

### Scopes

Use the service name as the scope:

- `frontend`, `backend`, `hooks`, `processor`, `worker`, `prisma`, `docs`

### Examples

```
feat(backend): add password hashing with bcrypt
fix(worker): handle Kafka consumer disconnect gracefully
docs(readme): add Docker Compose setup instructions
refactor(hooks): extract webhook validation to middleware
chore(deps): update Prisma to v7.4.0
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the [Coding Guidelines](#-coding-guidelines)

4. **Test locally** — ensure all services start without errors and your changes work

5. **Commit** using the [Commit Convention](#-commit-convention)

### Submitting a PR

1. Push your branch to your fork
2. Open a PR against the `main` branch of the upstream repo
3. Fill out the PR template completely
4. Link any related issues using `Closes #issue-number`
5. Wait for review from maintainers

### Review Checklist

Your PR will be reviewed for:

- [ ] Code quality and adherence to coding guidelines
- [ ] No secrets or credentials in the code
- [ ] Proper error handling
- [ ] Type safety (minimal use of `any`, `@ts-ignore`)
- [ ] Documentation updates if needed
- [ ] Backward compatibility (no breaking API changes without discussion)

### After Review

- Address reviewer feedback with additional commits
- Once approved, a maintainer will merge your PR
- Your contribution will be credited in the release notes! 🎉

---

## 📌 Issue Guidelines

### Labels

| Label                | Description                          |
| -------------------- | ------------------------------------ |
| `bug`                | Something isn't working              |
| `feature`            | New feature request                  |
| `good first issue`   | Good for newcomers                   |
| `help wanted`        | Extra attention is needed            |
| `documentation`      | Documentation improvements           |
| `enhancement`        | Improvement to existing feature      |
| `question`           | Further information requested        |
| `wontfix`            | Will not be worked on                |

---

Thank you for helping make ZFlow better! 💜
