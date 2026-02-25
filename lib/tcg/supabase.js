import { createClient } from '@supabase/supabase-js'
import { ensureServerEnv } from './env.js'

let cachedClient

export const getSupabaseAdmin = () => {
  ensureServerEnv()

  if (cachedClient) {
    return cachedClient
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const missing = []
    if (!supabaseUrl) {
      missing.push('VITE_SUPABASE_URL or SUPABASE_URL')
    }
    if (!serviceRoleKey) {
      missing.push('SUPABASE_SERVICE_ROLE_KEY')
    }

    throw new Error(
      `Missing environment variables: ${missing.join(', ')}. ` +
      `Present flags: VITE_SUPABASE_URL=${Boolean(process.env.VITE_SUPABASE_URL)}, ` +
      `SUPABASE_URL=${Boolean(process.env.SUPABASE_URL)}, ` +
      `SUPABASE_SERVICE_ROLE_KEY=${Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}.`,
    )
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return cachedClient
}
