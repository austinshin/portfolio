import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'
import { getSupabaseAdmin } from '../../lib/tcg/supabase.js'
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

  try {
    const supabase = getSupabaseAdmin()

    if (req.method === 'GET') {
      const includeInactive = req.query.includeInactive === 'true'
      let query = supabase
        .from('tcg_instagram_handles')
        .select('id, handle, is_active, created_at, last_checked_at, last_post_at')
        .order('created_at', { ascending: true })

      if (!includeInactive) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query
      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ handles: data || [] })
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const handle = normalizeHandle(body.handle)

      if (!handle) {
        return res.status(400).json({ error: 'Invalid handle. Use Instagram username format only.' })
      }

      const { data, error } = await supabase
        .from('tcg_instagram_handles')
        .upsert({ handle, is_active: true }, { onConflict: 'handle' })
        .select('id, handle, is_active, created_at, last_checked_at, last_post_at')
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ handle: data })
    }

    if (req.method === 'DELETE') {
      const body = parseBody(req)
      const target = normalizeHandle(
        typeof req.query.handle === 'string' ? req.query.handle : body.handle,
      )

      if (!target) {
        return res.status(400).json({ error: 'Missing handle' })
      }

      const { data, error } = await supabase
        .from('tcg_instagram_handles')
        .update({ is_active: false })
        .eq('handle', target)
        .select('id, handle, is_active, created_at, last_checked_at, last_post_at')
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ handle: data })
    }

    res.setHeader('Allow', 'GET,POST,DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process handle request',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
