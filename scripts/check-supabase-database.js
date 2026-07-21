const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  const envExamplePath = path.resolve(__dirname, '../.env.example');

  let envFile = fs.existsSync(envPath) ? envPath : envExamplePath;
  const content = fs.readFileSync(envFile, 'utf8');

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

async function checkDatabase() {
  loadEnv();
  const dbUrl = process.env.DATABASE_URL;

  console.log('--- Supabase PostgreSQL Database Health Check ---');

  if (!dbUrl || dbUrl.includes('your-password') || dbUrl.includes('your-project-ref')) {
    console.log('Status: DOWN');
    console.log('Reason: DATABASE_URL contains placeholder values in environment.');
    process.exit(0);
  }

  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Status: UP');
    console.log('Database connection successful.');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.log('Status: DOWN');
    console.log(`Error: Connection failed.`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkDatabase();
