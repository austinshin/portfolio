import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getApifyActorId, getPostsPerHandle, getScraperProvider } from './config.js'
import { notifyNewPosts } from './notifications.js'
import { getSupabaseAdmin } from './supabase.js'
import {
  extractHandleFromUrl,
  getFirstString,
  normalizeHandle,
  toIsoDate,
} from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const INSTALOADER_SCRIPT_PATH = path.resolve(__dirname, '../../scripts/tcg-instaloader.py')
const APIFY_BASE_URL = 'https://api.apify.com/v2'
const SCRAPER_PROVIDERS = new Set(['apify', 'instaloader'])

const normalizeScraperProvider = (value) => {
  const normalized = getFirstString(value).toLowerCase()
  return SCRAPER_PROVIDERS.has(normalized) ? normalized : ''
}

const toMediaType = (value) => {
  const type = getFirstString(value).toLowerCase()

  if (!type) return 'unknown'
  if (type.includes('video') || type.includes('reel')) return 'video'
  if (type.includes('carousel') || type.includes('sidecar')) return 'carousel'
  if (type.includes('image') || type.includes('photo')) return 'image'

  return type
}

const normalizePost = (item) => {
  const shortcode = getFirstString(item?.shortCode, item?.shortcode, item?.code)
  const rawExternalId = getFirstString(item?.id, item?.pk, item?.mediaid, shortcode)
  const permalink = getFirstString(
    item?.url,
    item?.postUrl,
    item?.permalink,
    shortcode ? `https://www.instagram.com/p/${shortcode}/` : '',
  )
  const handle = normalizeHandle(
    getFirstString(
      item?.ownerUsername,
      item?.owner?.username,
      item?.username,
      item?.user?.username,
      item?.sourceHandle,
      extractHandleFromUrl(item?.url),
      extractHandleFromUrl(item?.postUrl),
      extractHandleFromUrl(item?.permalink),
    ),
  )

  if (!rawExternalId || !permalink || !handle) {
    return null
  }

  return {
    external_post_id: rawExternalId,
    handle,
    permalink,
    caption: getFirstString(item?.caption, item?.text, item?.alt, item?.title) || null,
    media_type: toMediaType(item?.type || item?.mediaType || item?.__typename),
    thumbnail_url:
      getFirstString(
        item?.displayUrl,
        item?.display_url,
        item?.thumbnailUrl,
        item?.imageUrl,
        item?.image_url,
        item?.videoUrl,
        item?.video_url,
      ) || null,
    posted_at: toIsoDate(item?.timestamp, item?.takenAtTimestamp, item?.date),
    raw_json: item,
  }
}

const runCommand = async (command, args, env = process.env) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', (error) => {
      if (error && error.code === 'ENOENT') {
        reject(
          new Error(
            `Command not found: ${command}. This runtime cannot execute Instaloader locally. ` +
            `Use the GitHub Actions worker for syncs, or run sync from a machine with Python installed.`,
          ),
        )
        return
      }

      reject(error)
    })

    child.on('close', (code) => {
      if (code !== 0) {
        const details = stderr.trim() || stdout.trim() || `Exited with code ${code}`
        reject(new Error(details))
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

const toActorPath = (actorId) =>
  actorId
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

const flattenApifyItems = (items = [], handleSet = new Set()) => {
  const output = []

  for (const item of items) {
    if (!item || typeof item !== 'object') continue

    if (Array.isArray(item.latestPosts)) {
      for (const post of item.latestPosts) {
        if (post && typeof post === 'object') {
          output.push({
            ...post,
            ownerUsername: post.ownerUsername || item.username || item.userName || item.handle,
            sourceHandle: item.username || item.userName || item.handle,
          })
        }
      }
      continue
    }

    if (Array.isArray(item.items)) {
      for (const nested of item.items) {
        if (nested && typeof nested === 'object') {
          output.push({
            ...nested,
            ownerUsername: nested.ownerUsername || item.username || item.userName || item.handle,
            sourceHandle: item.username || item.userName || item.handle,
          })
        }
      }
      continue
    }

    output.push(item)
  }

  if (handleSet.size === 0) return output

  return output.map((item) => {
    const handle = normalizeHandle(
      getFirstString(
        item.ownerUsername,
        item.owner?.username,
        item.username,
        item.user?.username,
        item.sourceHandle,
      ),
    )
    if (handle) return item

    const guessed = extractHandleFromUrl(getFirstString(item.url, item.postUrl, item.permalink, item.inputUrl))
    if (guessed && handleSet.has(guessed)) {
      return {
        ...item,
        ownerUsername: guessed,
        sourceHandle: guessed,
      }
    }

    return item
  })
}

const fetchFromApify = async (handles, postsPerHandle) => {
  const token = getFirstString(process.env.APIFY_TOKEN)
  if (!token) {
    throw new Error('Missing APIFY_TOKEN for Apify scraping.')
  }

  const actorId = getApifyActorId()
  const input = {
    directUrls: handles.map((handle) => `https://www.instagram.com/${handle}/`),
    resultsType: 'posts',
    resultsLimit: Math.max(1, postsPerHandle),
    addParentData: false,
  }

  const endpoint = `${APIFY_BASE_URL}/acts/${toActorPath(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&clean=true`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Apify scraping failed (${response.status}): ${details}`)
  }

  const payload = await response.json()
  const rawItems = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : []
  const flattened = flattenApifyItems(rawItems, new Set(handles))

  return {
    items: flattened,
    authStatus: 'apify',
    scrapeErrors: [],
    successHandles: handles.length,
    totalHandles: handles.length,
  }
}

const fetchFromInstaloader = async (handles, postsPerHandle) => {
  const pythonExecutable = process.env.TCG_PYTHON_BIN || 'python3'
  const args = [
    INSTALOADER_SCRIPT_PATH,
    '--posts-per-handle',
    String(postsPerHandle),
    '--handles',
    ...handles,
  ]
  const { stdout } = await runCommand(pythonExecutable, args)

  let payload
  try {
    payload = JSON.parse(stdout)
  } catch {
    throw new Error('Instaloader scraper returned invalid JSON output.')
  }

  if (Array.isArray(payload)) {
    return {
      items: payload,
      authStatus: 'unknown',
      scrapeErrors: [],
      successHandles: 0,
      totalHandles: handles.length,
    }
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Instaloader scraper output had invalid structure.')
  }

  const items = Array.isArray(payload.posts) ? payload.posts : []
  const authStatus = getFirstString(payload.authStatus) || 'unknown'
  const scrapeErrors = Array.isArray(payload.errors)
    ? payload.errors.map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return { handle: '', stage: '', error: String(entry) }
      }
      return {
        handle: getFirstString(entry.handle),
        stage: getFirstString(entry.stage),
        error: getFirstString(entry.error) || String(entry),
      }
    })
    : []
  const successHandles = Number(payload.successHandles) > 0 ? Number(payload.successHandles) : 0
  const totalHandles = Number(payload.totalHandles) > 0 ? Number(payload.totalHandles) : handles.length

  return {
    items,
    authStatus,
    scrapeErrors,
    successHandles,
    totalHandles,
  }
}

const getActiveHandles = async (supabase) => {
  const { data, error } = await supabase
    .from('tcg_instagram_handles')
    .select('id, handle')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to read handles: ${error.message}`)
  }

  return data || []
}

const ensureHandles = async (supabase, handles) => {
  if (!handles.length) {
    return new Map()
  }

  const upsertPayload = handles.map((handle) => ({ handle, is_active: true }))

  const { error: upsertError } = await supabase
    .from('tcg_instagram_handles')
    .upsert(upsertPayload, { onConflict: 'handle' })

  if (upsertError) {
    throw new Error(`Failed to upsert handles: ${upsertError.message}`)
  }

  const { data, error } = await supabase
    .from('tcg_instagram_handles')
    .select('id, handle')
    .in('handle', handles)

  if (error) {
    throw new Error(`Failed to fetch handle IDs: ${error.message}`)
  }

  return new Map((data || []).map((row) => [row.handle, row.id]))
}

const getExistingPostIdSet = async (supabase, externalPostIds) => {
  if (externalPostIds.length === 0) {
    return new Set()
  }

  const { data, error } = await supabase
    .from('tcg_instagram_posts')
    .select('external_post_id')
    .in('external_post_id', externalPostIds)

  if (error) {
    throw new Error(`Failed to fetch existing post IDs: ${error.message}`)
  }

  return new Set((data || []).map((row) => row.external_post_id))
}

const dedupeAndSortPosts = (rawPosts, allowedHandles) => {
  const allowedHandleSet = new Set(allowedHandles)
  const byExternalId = new Map()

  for (const item of rawPosts) {
    const normalized = normalizePost(item)

    if (!normalized) {
      continue
    }

    if (!allowedHandleSet.has(normalized.handle)) {
      continue
    }

    const existing = byExternalId.get(normalized.external_post_id)
    if (!existing) {
      byExternalId.set(normalized.external_post_id, normalized)
      continue
    }

    if (new Date(normalized.posted_at).getTime() > new Date(existing.posted_at).getTime()) {
      byExternalId.set(normalized.external_post_id, normalized)
    }
  }

  return Array.from(byExternalId.values()).sort(
    (left, right) => new Date(right.posted_at).getTime() - new Date(left.posted_at).getTime(),
  )
}

const updateHandleStats = async (supabase, handles, posts) => {
  const checkedAt = new Date().toISOString()
  const latestByHandle = new Map()

  for (const post of posts) {
    const current = latestByHandle.get(post.handle)
    if (!current || new Date(post.posted_at).getTime() > new Date(current).getTime()) {
      latestByHandle.set(post.handle, post.posted_at)
    }
  }

  await Promise.all(
    handles.map(async (handle) => {
      const payload = {
        last_checked_at: checkedAt,
      }

      const latest = latestByHandle.get(handle)
      if (latest) {
        payload.last_post_at = latest
      }

      const { error } = await supabase
        .from('tcg_instagram_handles')
        .update(payload)
        .eq('handle', handle)

      if (error) {
        throw new Error(`Failed to update handle ${handle}: ${error.message}`)
      }
    }),
  )
}

export const syncInstagramPosts = async (options = {}) => {
  const supabase = getSupabaseAdmin()
  const requestedProvider = normalizeScraperProvider(options.provider)
  const scraperProvider = requestedProvider || getScraperProvider()
  const requestedHandles = Array.isArray(options.handles)
    ? options.handles.map(normalizeHandle).filter(Boolean)
    : []
  const notify = options.notify !== false
  const postsPerHandle = Number(options.postsPerHandle) > 0
    ? Number(options.postsPerHandle)
    : getPostsPerHandle()

  let handles = requestedHandles
  if (handles.length === 0) {
    const activeHandles = await getActiveHandles(supabase)
    handles = activeHandles.map((row) => row.handle)
  }

  handles = Array.from(new Set(handles))

  if (handles.length === 0) {
    return {
      provider: scraperProvider,
      authStatus: 'n/a',
      handles: [],
      fetched: 0,
      inserted: 0,
      notified: 0,
      notificationErrors: [],
      latest: [],
    }
  }

  await ensureHandles(supabase, handles)

  const scrapedResult = scraperProvider === 'apify'
    ? await fetchFromApify(handles, postsPerHandle)
    : await fetchFromInstaloader(handles, postsPerHandle)
  const scrapedRawPosts = scrapedResult.items
  const normalizedPosts = dedupeAndSortPosts(scrapedRawPosts, handles)

  const existingPostIds = await getExistingPostIdSet(
    supabase,
    normalizedPosts.map((post) => post.external_post_id),
  )
  const newPosts = normalizedPosts.filter((post) => !existingPostIds.has(post.external_post_id))
  const handleIdMap = await ensureHandles(
    supabase,
    Array.from(new Set([...handles, ...newPosts.map((post) => post.handle)])),
  )

  const postsToInsert = newPosts.map((post) => ({
    ...post,
    handle_id: handleIdMap.get(post.handle) || null,
  }))

  if (postsToInsert.length > 0) {
    const { error } = await supabase
      .from('tcg_instagram_posts')
      .upsert(postsToInsert, { onConflict: 'external_post_id', ignoreDuplicates: true })

    if (error) {
      throw new Error(`Failed to store posts: ${error.message}`)
    }
  }

  await updateHandleStats(supabase, handles, normalizedPosts)

  const notificationResult = notify
    ? await notifyNewPosts(postsToInsert)
    : { sent: 0, errors: [] }

  return {
    provider: scraperProvider,
    authStatus: scrapedResult.authStatus,
    scrapeErrors: scrapedResult.scrapeErrors || [],
    successHandles: scrapedResult.successHandles || 0,
    totalHandles: scrapedResult.totalHandles || handles.length,
    handles,
    fetched: normalizedPosts.length,
    inserted: postsToInsert.length,
    notified: notificationResult.sent,
    notificationErrors: notificationResult.errors,
    latest: postsToInsert.slice(0, 5),
  }
}
