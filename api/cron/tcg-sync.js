import { syncInstagramPosts } from '../../lib/tcg/sync.js'
import { ensureServerEnv } from '../../lib/tcg/env.js'

ensureServerEnv()

const isCronAuthorized = (req) => {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization

  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`
  }

  return typeof req.headers['x-vercel-cron'] === 'string'
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET,POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isCronAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized cron invocation' })
  }

  try {
    const result = await syncInstagramPosts({ notify: true })
    return res.status(200).json({ ok: true, result })
  } catch (error) {
    return res.status(500).json({
      error: 'Cron sync failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
