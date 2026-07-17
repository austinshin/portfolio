import { createClient } from '@supabase/supabase-js'

// Verifies the Supabase access token sent by the frontend. The AI endpoints
// call Claude on the site owner's dime, so they require a logged-in user.
export async function requireUser(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({ error: 'Supabase is not configured on the server' })
    return null
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Sign in at /login to use this tool.' })
    return null
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) {
    res.status(401).json({ error: 'Session expired — sign in again at /login.' })
    return null
  }

  return data.user
}
