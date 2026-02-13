<p align="center">
  <h1 align="center">⚡ ZFlow</h1>
  <p align="center">
    A self-hosted workflow automation platform — trigger webhooks, chain actions, send emails, and transfer SOL, all through a clean, modern UI.
  </p>
  <p align="center">
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-contributing">Contributing</a> •
    <a href="#-license">License</a>
  </p>
</p>

---

## 📖 Overview

ZFlow is an **open-source workflow automation engine** that allows users to create automated workflows consisting of a **trigger** and one or more **actions**. When a webhook is received, the system processes the event through a Kafka-based pipeline and executes each action in sequence.

### ✨ Key Features

- 🔗 **Webhook Triggers** — Create webhook URLs that trigger automated workflows
- 📧 **Email Actions** — Send templated emails with dynamic data from trigger payloads
- 💸 **Solana Transfers** — Automate SOL transfers on the Solana blockchain
- 🔄 **Sequential Action Pipeline** — Chain multiple actions using Kafka for reliable processing
- 🎨 **Modern Frontend** — Built with Next.js and Tailwind CSS for a responsive UI
- 🔒 **JWT Authentication** — Secure user authentication and authorization
- 🗄️ **Transactional Outbox Pattern** — Reliable event processing with PostgreSQL + Kafka

---

## 🏗️ Architecture

The project follows a **microservices architecture** with the following components:

```
┌───────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Frontend    │────▶│ Primary Backend  │────▶│  PostgreSQL  │
│  (Next.js)    │     │   (Express.js)   │     │   Database   │
│  Port: 3000   │     │   Port: 3001     │     │  Port: 5432  │
└───────────────┘     └──────────────────┘     └──────┬───────┘
                                                       │
┌───────────────┐     ┌──────────────────┐             │
│  Hooks Server │────▶│   ZapRunOutbox   │◀────────────┘
│  (Express.js) │     │   (DB Table)     │
│  Port: 3002   │     └──────────────────┘
└───────────────┘              │
                               ▼
                      ┌──────────────────┐
                      │    Processor     │
                      │   (Outbox ──▶    │
                      │     Kafka)       │
                      └────────┬─────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │     Apache       │
                      │     Kafka        │
                      │  Port: 9092      │
                      └────────┬─────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │     Worker       │
                      │  (Consumers)     │
                      │  Email / SOL     │
                      └──────────────────┘
```

| Service              | Description                                              | Default Port |
| -------------------- | -------------------------------------------------------- | ------------ |
| **Frontend**         | Next.js web application for creating and managing Zaps   | `3000`       |
| **Primary Backend**  | REST API for auth, Zap CRUD, triggers, and actions       | `3001`       |
| **Hooks**            | Webhook receiver that creates ZapRun entries             | `3002`       |
| **Processor**        | Polls the outbox table and publishes events to Kafka     | —            |
| **Worker**           | Consumes Kafka events and executes actions sequentially  | —            |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) v10+
- [PostgreSQL](https://www.postgresql.org/) v14+
- [Apache Kafka](https://kafka.apache.org/) (with Zookeeper or KRaft)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Rishi713144/ZFlow.git
cd ZFlow
```

### 2. Set Up Environment Variables

Each service requires its own `.env` file. Copy the provided examples and fill in your values:

```bash
# Primary Backend
cp primary-backend/.env.example primary-backend/.env

# Hooks
cp hooks/.env.example hooks/.env

# Processor
cp processor/.env.example processor/.env

# Worker
cp worker/.env.example worker/.env
```

> ⚠️ **Important:** Never commit `.env` files. They are already in `.gitignore`.



### 3. Install Dependencies

```bash
# Root dependencies
pnpm install

# Install for each service
cd primary-backend && pnpm install && cd ..
cd hooks && pnpm install && cd ..
cd processor && pnpm install && cd ..
cd worker && pnpm install && cd ..
cd frontend && pnpm install && cd ..
```

### 4. Set Up the Database

```bash
cd primary-backend

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database with initial triggers and actions
npx prisma db seed

cd ..
```

### 5. Start Kafka

Make sure Kafka is running on `localhost:9092` (or update `KAFKA_BROKERS` in your `.env` files).

```bash
# Example using Docker
docker run -d --name zookeeper -p 2181:2181 wurstmeister/zookeeper
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  wurstmeister/kafka
```

### 6. Run All Services

Open separate terminal windows for each service:

```bash
# Terminal 1 — Primary Backend
cd primary-backend && pnpm dev

# Terminal 2 — Hooks Server
cd hooks && pnpm dev

# Terminal 3 — Processor
cd processor && pnpm dev

# Terminal 4 — Worker
cd worker && pnpm dev

# Terminal 5 — Frontend
cd frontend && pnpm dev
```

The app will be available at **http://localhost:3000**.

---


## 📡 API Reference

### Authentication

| Method | Endpoint               | Description         | Auth Required |
| ------ | ---------------------- | ------------------- | ------------- |
| POST   | `/api/v1/user/signup`  | Register a new user | No            |
| POST   | `/api/v1/user/signin`  | Sign in and get JWT | No            |
| GET    | `/api/v1/user/`        | Get current user    | Yes           |

### Flows

| Method | Endpoint               | Description             | Auth Required |
| ------ | ---------------------- | ----------------------- | ------------- |
| POST   | `/api/v1/zap/`         | Create a new Flow       | Yes           |
| GET    | `/api/v1/zap/`         | List all user's Flows   | Yes           |
| GET    | `/api/v1/zap/:zapId`   | Get a specific Flow     | Yes           |

### Triggers & Actions

| Method | Endpoint                      | Description                  | Auth Required |
| ------ | ----------------------------- | ---------------------------- | ------------- |
| GET    | `/api/v1/trigger/available`   | List available trigger types | No            |
| GET    | `/api/v1/action/available`    | List available action types  | No            |

### Webhooks

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| POST   | `/hooks/catch/:userId/:zapId`       | Trigger a Flow via webhook |

---

## 🗄️ Database Schema

The application uses **PostgreSQL** with **Prisma ORM**. Key models:

- **User** — Registered users
- **Flow** — A workflow with one trigger and multiple actions
- **Trigger** — The event that starts a Flow (e.g., Webhook)
- **Action** — A step in the Flow (e.g., Send Email, Send SOL)
- **AvailableTrigger / AvailableAction** — Catalog of supported trigger/action types
- **FlowRun** — An execution instance of a Flow
- **FlowRunOutbox** — Transactional outbox for reliable Kafka publishing

To explore the schema:

```bash
cd primary-backend
npx prisma studio
```

---

## 🧪 Development

### Project Structure

```
ZFlow/
├── frontend/              # Next.js web application
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   └── public/            # Static assets
├── primary-backend/       # Main REST API server
│   ├── prisma/            # Database schema & migrations
│   └── src/
│       ├── router/        # Express route handlers
│       ├── middleware.ts   # Auth middleware
│       ├── config.ts      # App configuration
│       └── db/            # Prisma client setup
├── hooks/                 # Webhook receiver service
│   ├── prisma/            # Shared schema reference
│   └── src/
├── processor/             # Outbox → Kafka publisher
│   ├── prisma/            # Shared schema reference
│   └── src/
├── worker/                # Kafka consumer & action executor
│   ├── prisma/            # Shared schema reference
│   └── src/
│       ├── email.ts       # Email sending logic
│       ├── solana.ts      # Solana transfer logic
│       └── parser.ts      # Template variable parser
├── CONTRIBUTING.md        # Contribution guidelines

├── LICENSE                # MIT License
└── README.md                 # Project overview & setup
```

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, new features, documentation improvements, or just reporting issues — every bit helps.

Please read our **[Contributing Guide](CONTRIBUTING.md)** before submitting a pull request.

---

## ✨ Features (Implemented)

- [x] 🔑 **Email Verification** — Secure signup with verification tokens
- [x] 🔄 **Password Reset** — Self-service password recovery flow
- [x] 🔐 **Secure Auth** — Password hashing with bcrypt for user security
- [x] 🎨 **Visual Builder** — Interactive **React Flow** canvas for designing Zaps
- [x] 🔀 **Parallel Actions** — Branching workflows with stage-based execution
- [x] 🛡️ **Blockchain Replay Prevention** — Signature tracking & reconciliation for Solana
- [x] 🐳 **Infrastructure-as-Code** — Ready-to-use Docker Compose setup

## 📝 Roadmap (Upcoming)

- [ ] ✅ Comprehensive unit & integration test suite
- [ ] 📊 Real-time monitoring and execution logs
- [ ] 🔌 Extensible plugin system for custom integrations

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Zapier and the automation-first workflow philosophy
- Built with love by the open-source community

---

<p align="center">
  <sub>If you found this project useful, please consider giving it a ⭐</sub>
</p>
