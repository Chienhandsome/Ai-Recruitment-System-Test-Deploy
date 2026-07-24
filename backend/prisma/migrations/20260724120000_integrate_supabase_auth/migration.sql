-- Supabase Auth owns credentials and identities. Application users reuse the
-- auth.users UUID as their primary key.

-- Drop foreign keys that depend on public.users.id before changing the type.
ALTER TABLE "user_roles"
  DROP CONSTRAINT IF EXISTS "user_roles_user_id_fkey";

ALTER TABLE "recruiter_profiles"
  DROP CONSTRAINT IF EXISTS "recruiter_profiles_user_id_fkey";

ALTER TABLE "candidates"
  DROP CONSTRAINT IF EXISTS "candidates_user_id_fkey";

-- Password hashes must only be stored and managed by Supabase Auth.
ALTER TABLE "users"
  DROP COLUMN IF EXISTS "password_hash";

-- The database is currently empty, so all user references can safely move from
-- text to the UUID type used by auth.users.
ALTER TABLE "users"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid;

ALTER TABLE "user_roles"
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

ALTER TABLE "recruiter_profiles"
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

ALTER TABLE "candidates"
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

ALTER TABLE "notifications"
  ALTER COLUMN "recipient_user_id" TYPE UUID USING "recipient_user_id"::uuid;

ALTER TABLE "application_status_histories"
  ALTER COLUMN "changed_by_user_id" TYPE UUID USING "changed_by_user_id"::uuid;

ALTER TABLE "audit_logs"
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

-- Recreate the application account status enum without duplicating Supabase's
-- email-confirmation state.
ALTER TABLE "users"
  ALTER COLUMN "status" DROP DEFAULT;

CREATE TYPE "AccountStatus_new" AS ENUM ('ACTIVE', 'SUSPENDED', 'LOCKED');

ALTER TABLE "users"
  ALTER COLUMN "status" TYPE "AccountStatus_new"
  USING (
    CASE "status"::text
      WHEN 'INACTIVE' THEN 'SUSPENDED'
      WHEN 'BLOCKED' THEN 'LOCKED'
      WHEN 'PENDING' THEN 'SUSPENDED'
      ELSE "status"::text
    END
  )::"AccountStatus_new";

DROP TYPE "AccountStatus";
ALTER TYPE "AccountStatus_new" RENAME TO "AccountStatus";

ALTER TABLE "users"
  ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- Restore application relations.
ALTER TABLE "user_roles"
  ADD CONSTRAINT "user_roles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recruiter_profiles"
  ADD CONSTRAINT "recruiter_profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "candidates"
  ADD CONSTRAINT "candidates_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Supabase projects expose auth.users in the auth schema. The conditional block
-- keeps Prisma shadow-database validation usable outside Supabase.
DO $$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_id_auth_users_fkey"
      FOREIGN KEY ("id") REFERENCES "auth"."users"("id")
      ON DELETE CASCADE;
  END IF;
END
$$;

-- The browser only talks to Supabase Auth. Application tables stay behind the
-- NestJS API, so enable RLS without public policies and revoke PostgREST roles.
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'companies',
    'departments',
    'users',
    'roles',
    'user_roles',
    'recruiter_profiles',
    'job_postings',
    'skills',
    'skill_aliases',
    'job_skills',
    'candidates',
    'resumes',
    'resume_parsed_data',
    'candidate_skills',
    'cv_upload_batches',
    'applications',
    'ai_matching_results',
    'interview_questions',
    'interviews',
    'notifications',
    'unrecognized_skills',
    'application_status_histories',
    'audit_logs',
    'infrastructure_health_records'
  ]
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
      table_name
    );
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM authenticated;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
  END IF;
END
$$;
