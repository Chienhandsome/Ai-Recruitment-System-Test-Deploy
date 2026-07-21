# Database Conventions

## 1. Naming Conventions

* **Tables**: `snake_case`, plural format (e.g., `users`, `job_postings`, `candidate_skills`).
* **Columns**: `snake_case` (e.g., `full_name`, `created_at`, `password_hash`).
* **Prisma Models**: `PascalCase`, singular format (e.g., `User`, `JobPosting`, `CandidateSkill`).
* **Prisma Fields**: `camelCase` (e.g., `fullName`, `createdAt`, `passwordHash`).
* **Enums**: `PascalCase` for enum names (e.g., `AccountStatus`), `UPPER_SNAKE_CASE` for values (e.g., `ACTIVE`, `PENDING_REVIEW`).

*Every Prisma model must use the `@map` or `@@map` decorators to bind `camelCase`/`PascalCase` names to PostgreSQL `snake_case`.*

## 2. Standardized Columns

Every table should include:
* `id`: `String @id @default(uuid())` - using UUIDv4 for all primary keys.
* `createdAt`: `DateTime @default(now()) @map("created_at")`
* `updatedAt`: `DateTime @updatedAt @map("updated_at")` (Only for entities that change over time. Read-only or append-only tables may omit this).

## 3. Relationships & Foreign Keys

* Foreign keys should end with `Id` in Prisma and `_id` in PostgreSQL (e.g., `userId` -> `user_id`).
* **Cascading**:
  * Use `onDelete: Cascade` for child entities that cannot exist without their parent (e.g., `ResumeParsedData` cascades when `Resume` is deleted, `CandidateSkill` cascades when `Candidate` is deleted).
  * Do NOT cascade for crucial historical tracking or audit logs, or for users to maintain data integrity.
* **Many-to-Many**: Represented via explicit mapping tables (e.g., `UserRole` instead of an implicit many-to-many list) to allow adding metadata to the relation later.

## 4. Indexing Strategy

* Add `@@index([...])` to foreign keys frequently used in queries (e.g., `jobId` in `Application`).
* Add indexes to fields commonly used for filtering and sorting (e.g., `status`, `email`, `processingStatus`).
* Use `@@unique([...])` for composite unique constraints (e.g., `[userId, roleId]` in `UserRole`).

## 5. Security and Data Protection

* Never log sensitive data (like `passwordHash`) to `AuditLog`.
* Passwords must always be hashed.
* Database connections must be established via `DATABASE_URL` (Transaction pooler) for runtime, and `DIRECT_URL` (Direct connection) for migrations (`npx prisma migrate dev`).
