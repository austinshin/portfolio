import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isTcgAuthorized(req)) {
    return rejectUnauthorized(res)
  }

  return res.status(200).json({ ok: true })
}
