import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'
import { sendTelegramTestNotification } from '../../lib/tcg/notifications.js'

export default async function handler(req, res) {
  if (!isTcgAuthorized(req)) {
    return rejectUnauthorized(res)
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await sendTelegramTestNotification()
    return res.status(200).json({ ok: true, result })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to send test Telegram message',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
