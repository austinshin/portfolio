import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'
import { DEFAULT_FEED_LIMIT, MAX_FEED_LIMIT } from '../../lib/tcg/constants.js'
import { getSupabaseAdmin } from '../../lib/tcg/supabase.js'
import { clamp, normalizeHandle } from '../../lib/tcg/utils.js'

export default async function handler(req, res) {
  if (!isTcgAuthorized(req)) {
    return rejectUnauthorized(res)
  }

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'GET,DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const limit = clamp(Number(req.query.limit || DEFAULT_FEED_LIMIT), 1, MAX_FEED_LIMIT)
  const handleFilter = normalizeHandle(typeof req.query.handle === 'string' ? req.query.handle : '')

  try {
    const supabase = getSupabaseAdmin()
    const { data: handleRows, error: handleError } = await supabase
      .from('tcg_instagram_handles')
      .select('handle')
      .eq('is_active', true)

    if (handleError) {
      throw new Error(handleError.message)
    }

    const activeHandles = (handleRows || []).map((row) => row.handle)

    if (activeHandles.length === 0) {
      return req.method === 'GET'
        ? res.status(200).json({ posts: [] })
        : res.status(200).json({ deleted: 0 })
    }

    if (handleFilter && !activeHandles.includes(handleFilter)) {
      return req.method === 'GET'
        ? res.status(200).json({ posts: [] })
        : res.status(200).json({ deleted: 0 })
    }

    const handlesToQuery = handleFilter ? [handleFilter] : activeHandles
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('tcg_instagram_posts')
        .select('id, handle, caption, permalink, thumbnail_url, media_type, posted_at, created_at')
        .in('handle', handlesToQuery)
        .order('posted_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ posts: data || [] })
    }

    const { count, error: countError } = await supabase
      .from('tcg_instagram_posts')
      .select('id', { count: 'exact', head: true })
      .in('handle', handlesToQuery)

    if (countError) {
      throw new Error(countError.message)
    }

    const { error: deleteError } = await supabase
      .from('tcg_instagram_posts')
      .delete()
      .in('handle', handlesToQuery)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    return res.status(200).json({ deleted: count || 0 })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to load feed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
