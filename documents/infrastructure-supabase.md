# Infrastructure Architecture - Supabase & RabbitMQ Integration

This document describes the architectural setup and connectivity patterns for Supabase PostgreSQL, Supabase Storage, and RabbitMQ in the AI Recruitment System.

---

## 1. Supabase PostgreSQL Integration

* **Role**: Primary Managed PostgreSQL relational database.
* **ORM Layer**: Prisma Client (`v6.4.0`) inside the NestJS Backend (`/backend`).
* **Connection Strings**:
  * `DATABASE_URL`: Transaction pooler string (Port `6543`, `pgbouncer=true`).
  * `DIRECT_URL`: Direct database connection string (Port `5432`).
* **Security & Isolation**:
  * Direct database access is strictly encapsulated within NestJS services via `PrismaService`.
  * Frontend components never query Supabase REST APIs or PostgreSQL directly.

---

## 2. Supabase Storage Integration

* **Role**: Cloud Object Storage for resumes, CV documents, and candidate attachments.
* **Bucket Name**: `resumes`
* **Access Control**: **PRIVATE** (`public: false`). Direct public URL generation is disabled.
* **Access Layer**:
  * Server-side operations in NestJS using `@supabase/supabase-js` configured with `SUPABASE_SECRET_KEY` (or fallback `SUPABASE_SERVICE_ROLE_KEY`).
  * `SUPABASE_SECRET_KEY` is kept strictly within backend environment variables and is never exposed to the frontend browser bundle.
* **Download Access**:
  * Short-lived **Signed URLs** generated on-demand via `SupabaseStorageService.createSignedDownloadUrl()` (Default TTL: 300 seconds).

---

## 3. RabbitMQ Messaging Service

* **Role**: Asynchronous event broker for delegating background processing tasks (e.g. CV parsing & AI analysis) between NestJS and Python FastAPI AI Service.
* **Deployment**: Local container managed via `docker-compose.yml`.
* **Broker Endpoint**: `amqp://guest:guest@localhost:5672`
* **Management UI**: `http://localhost:15672`
* **NestJS Adapter**: Managed via `amqp-connection-manager` providing automatic reconnection and graceful degradation without crashing NestJS if the broker is offline.

---

## 4. Protected Secrets & Environment Variables

| Variable Name | Scope | Sensitivity Level | Description |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | Backend | Medium | Base URL of the Supabase project |
| `SUPABASE_PUBLISHABLE_KEY` | Backend | Medium | Client publishable key (formerly `SUPABASE_ANON_KEY`) |
| `SUPABASE_SECRET_KEY` | Backend Only | **HIGH / CRITICAL** | Admin secret key with full access bypass (formerly `SUPABASE_SERVICE_ROLE_KEY`) |
| `DATABASE_URL` | Backend Only | **HIGH / CRITICAL** | PostgreSQL database credentials |
| `RABBITMQ_DEFAULT_PASS` | Infra / Backend | Medium | RabbitMQ broker authentication password |
