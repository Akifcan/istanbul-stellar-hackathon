// Creates the public storage bucket for ad creatives (idempotent).
//
// Usage:  node --env-file=.env scripts/setup-storage.mjs

import { createClient } from "@supabase/supabase-js"

const ref = process.env.SUPABASE_PROJECT_ID
const secretKey = process.env.SUPABASE_SECRET_KEY
const BUCKET = "ad-creatives"

if (!ref || !secretKey) {
  console.error("Missing SUPABASE_PROJECT_ID or SUPABASE_SECRET_KEY.")
  process.exit(1)
}

const supabase = createClient(`https://${ref}.supabase.co`, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: buckets, error: listError } = await supabase.storage.listBuckets()
if (listError) {
  console.error("Failed to list buckets:", listError.message)
  process.exit(1)
}

if (buckets.some((b) => b.name === BUCKET)) {
  console.log(`Bucket "${BUCKET}" already exists.`)
  process.exit(0)
}

const { error } = await supabase.storage.createBucket(BUCKET, {
  public: true,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  fileSizeLimit: "5MB",
})

if (error) {
  console.error("Failed to create bucket:", error.message)
  process.exit(1)
}

console.log(`Created public bucket "${BUCKET}".`)
