import "server-only"
import { createClient } from "@supabase/supabase-js"

const ref = process.env.SUPABASE_PROJECT_ID
const secretKey = process.env.SUPABASE_SECRET_KEY

if (!ref || !secretKey) {
  throw new Error(
    "Missing SUPABASE_PROJECT_ID or SUPABASE_SECRET_KEY environment variables."
  )
}

// Server-only client using the secret key. Bypasses RLS — never import this
// from a Client Component.
export const supabaseAdmin = createClient(`https://${ref}.supabase.co`, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export const AD_CREATIVES_BUCKET = "ad-creatives"
