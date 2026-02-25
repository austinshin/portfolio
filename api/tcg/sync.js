import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'
import { syncInstagramPosts } from '../../lib/tcg/sync.js'
import { normalizeHandle } from '../../lib/tcg/utils.js'

const parseBody = (req) => {
  if (!req.body) return {}

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }

  if (typeof req.body === 'object') {
    return req.body
  }

  return {}
}

export default async function handler(req, res) {
  if (!isTcgAuthorized(req)) {
    return rejectUnauthorized(res)
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = parseBody(req)
    const handles = Array.isArray(body.handles)
      ? body.handles.map(normalizeHandle).filter(Boolean)
      : undefined
    const postsPerHandle = Number(body.postsPerHandle)
    const notify = body.notify !== false

    const result = await syncInstagramPosts({
      handles,
      postsPerHandle: Number.isFinite(postsPerHandle) && postsPerHandle > 0 ? postsPerHandle : undefined,
      notify,
    })

    return res.status(200).json({ ok: true, result })
  } catch (error) {
    return res.status(500).json({
      error: 'Sync failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
