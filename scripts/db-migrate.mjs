// Runs every .sql file in supabase/migrations (in name order) against the
// Supabase Postgres instance via the session pooler.
//
// Usage:  node --env-file=.env scripts/db-migrate.mjs
//
// Reads from env: SUPABASE_PROJECT_ID, SUPABASE_PROJECT_REGION, DB_SECRET

import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const ref = process.env.SUPABASE_PROJECT_ID
const region = process.env.SUPABASE_PROJECT_REGION
const password = process.env.DB_SECRET

if (!ref || !region || !password) {
  console.error(
    "Missing env. Need SUPABASE_PROJECT_ID, SUPABASE_PROJECT_REGION, DB_SECRET."
  )
  process.exit(1)
}

const here = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(here, "..", "supabase", "migrations")

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort()

const client = new pg.Client({
  host: `aws-0-${region}.pooler.supabase.com`,
  port: 5432,
  user: `postgres.${ref}`,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log(`Connected to project ${ref} (${region}).`)

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8")
    process.stdout.write(`Applying ${file} … `)
    await client.query(sql)
    console.log("done")
  }

  const { rows } = await client.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' order by table_name`
  )
  console.log(
    "Public tables:",
    rows.map((r) => r.table_name).join(", ") || "(none)"
  )
} catch (err) {
  console.error("\nMigration failed:", err.message)
  process.exit(1)
} finally {
  await client.end()
}
