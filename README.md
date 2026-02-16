<p align="center">
  <h1 align="center">⚡ ZFlow</h1>
  <p align="center">
    <strong>A professional, self-hosted workflow automation platform.</strong>
  </p>
  <p align="center">
    Trigger webhooks, chain multi-stage actions, send automated emails, and execute Solana blockchain transfers—all through a unified, modern interface.
  </p>
  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</p>

---

## 📖 Overview

ZFlow is a high-performance automation engine designed for reliability and scale. Built on a microservices architecture, it allows users to create **Zaps**—automated workflows that combine a single trigger with sequential actions.

### ✨ Key Features

- 🔗 **Webhook Triggers** — Instantly trigger workflows from any external service.
- 📧 **Native Email Integration** — Send templated, dynamic emails using incoming trigger data.
- 💸 **Solana Automated Transfers** — Execute SOL transfers on-chain automatically.
- 🔄 **Sequential Pipeline** — Chain multiple actions using **Kafka** for resilient processing.
- 🎨 **Visual Builder** — An intuitive canvas for designing complex logic visually.
- 🔒 **Enterprise-Grade Reliability** — Implements the **Transactional Outbox Pattern** to ensure no event is ever lost.

---

## 📂 Project Structure

ZFlow is organized as a monorepo using **pnpm workspaces**. Each service is independent but shares the same infrastructure.

```text
zapier/
├── frontend/           # Next.js dashboard & React Flow canvas
├── primary-backend/    # Main REST API, Auth, & Zap management
├── hooks/              # Lightweight webhook receiver
├── processor/          # Outbox-to-Kafka reliability engine
├── worker/             # Event consumer & action executor
├── docker-compose.yml  # Production stack (Dokploy optimized)
└── package.json        # Monorepo configuration
```

---

## 🔄 The ZFlow Workflow (Data Flow)

Understanding how data travels through ZFlow is key to understanding its reliability:

1.  **Entry (Hooks)**: A third-party service sends a POST request to the `hooks` service. 
2.  **Persistence (Outbox)**: The `hooks` service saves the incoming data to the `ZapRun` table and creates a entry in the `ZapRunOutbox` table. This happens in a single **atomic database transaction**.
3.  **Relay (Processor)**: The `processor` service continuously polls the `ZapRunOutbox`. When it finds an entry, it publishes a message to **Apache Kafka** and deletes the entry from the outbox.
4.  **Execution (Worker)**: The `worker` service listens to the Kafka topic. It parses the trigger data, identifies the first action (e.g., Send Email), and executes it.
5.  **Chaining**: If there are subsequent actions, the worker pushes a new message back to Kafka with `stage: stage + 1`, ensuring the next action is picked up reliably.

---

## 🏗️ Architecture

ZFlow is decoupled into specialized microservices to ensure independent scalability and fault tolerance:

- **Frontend**: Next.js dashboard for visual workflow management.
- **Primary Backend**: REST API handling authentication, logic CRUD, and database management.
- **Hooks**: A high-throughput receiver service dedicated to catching incoming webhooks.
- **Processor**: A reliability engine that moves events from the database outbox to the message queue.
- **Worker**: The execution engine that consumes Kafka events and performs the actions.

---

## 🛠️ Core Engineering Concepts

To achieve high availability and data integrity, ZFlow implements several advanced patterns:

### 📥 Transactional Outbox Pattern
We don't send messages to Kafka directly when a webhook arrives. Instead, we save the event to the database and a temporary "Outbox" table in a **single transaction**. This ensures that if the DB save fails, we don't send a message, and if Kafka is down, we have the record safely in our DB to retry later.

### 🛡️ Event Idempotency
The system ensures that actions aren't executed twice by mistake. If a worker crashes halfway through a task and Kafka retries the message, the worker checks the `ZapRunAction` table to see if that specific stage was already successful before running it again.

### 🧩 Template Parsing
The worker uses a custom-built parser to inject dynamic data from incoming webhooks into your actions (e.g., using `{{body.amount}}` in an email or a SOL transaction).

---

## 🚀 Getting Started

ZFlow is built as a complex multi-service application. The easiest way to test the platform locally is using Docker Compose.

### 💻 Local Development
Expose all ports and services for local testing:
```bash
docker-compose --env-file .env -f docker-compose.dev.yml up --build
```

### 🛠️ Manual Setup

If you prefer to run services individually without Docker, follow these steps:

#### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Apache Kafka](https://kafka.apache.org/)

#### 2. Install Dependencies
```bash
pnpm install
```

#### 3. Database Setup
```bash
cd primary-backend
npx prisma migrate dev
npx prisma db seed
```

#### 4. Environment Variables
Copy the `.env.example` file in each service directory to `.env` and fill in the required values:
- `primary-backend/.env`
- `hooks/.env`
- `processor/.env`
- `worker/.env`
- `frontend/.env`

#### 5. Run Services
Open separate terminals for each service:
```bash
# Terminal 1: Backend
cd primary-backend && pnpm dev

# Terminal 2: Hooks
cd hooks && pnpm dev

# Terminal 3: Processor
cd processor && pnpm dev

# Terminal 4: Worker
cd worker && pnpm dev

# Terminal 5: Frontend
cd frontend && pnpm dev
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether you are fixing bugs, improving documentation, or proposing new features, your help is appreciated. ZFlow is an evolving platform, and your feedback—whether it's a new integration idea or a UI tweak—helps make it better for everyone.

If you'd like to contribute:
1. **Fork** the repository and create your branch from `main`.
2. **Commit** your changes with clear, atomized, and descriptive messages.
3. **Open a Pull Request** that follows our professional standards:
   - **Clear Description**: Explain the *why* and the *how* behind your changes.
   - **Screenshots/Videos**: Mandatory for any UI or visual workflow changes.
   - **Scope**: Keep PRs focused. It's better to submit three small, clean PRs than one giant, complex one.
   - **Quality Assurance**: Ensure your code is linted, follows the established TypeScript patterns, and doesn't break existing local development flows.

We believe in the power of open source and look forward to building the future of automation together! By maintaining high standards for our Pull Requests, we ensure ZFlow remains a robust and reliable tool for everyone.

---

## 📄 License

This project is licensed under the **MIT License**.
