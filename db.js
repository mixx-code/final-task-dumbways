import { Pool } from "pg";

let pool;

if (process.env.DATABASE_URL) {
  // 🌐 Koneksi Neon / Vercel Postgres (production)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Neon butuh SSL
    },
  });
  console.log("✅ Connected to Neon/PostgreSQL (via DATABASE_URL)");
} else {
  // 💻 Koneksi lokal (development)
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "final-task",
    password: "rizki",
    port: 5432,
  });
  console.log("✅ Connected to local PostgreSQL");
}

export default pool;
