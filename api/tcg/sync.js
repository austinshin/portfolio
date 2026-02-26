import { isTcgAuthorized, rejectUnauthorized } from '../../lib/tcg/auth.js'
import { getScraperProvider } from '../../lib/tcg/config.js'
import { syncInstagramPosts } from '../../lib/tcg/sync.js'
import { getFirstString, normalizeHandle } from '../../lib/tcg/utils.js'

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

const normalizeSyncExecutor = (value) => {
  const normalized = getFirstString(value).toLowerCase()

  if (normalized === 'github') return 'github'
  if (normalized === 'local') return 'local'

  return 'auto'
}

const parseGithubRepository = () => {
  const repository = getFirstString(process.env.GITHUB_REPOSITORY)
  if (repository.includes('/')) {
    const [owner, name] = repository.split('/', 2).map((part) => part.trim())
    if (owner && name) {
      return { owner, name }
    }
  }

  const owner = getFirstString(process.env.GITHUB_REPO_OWNER)
  const name = getFirstString(process.env.GITHUB_REPO_NAME)
  if (owner && name) {
    return { owner, name }
  }

  return { owner: '', name: '' }
}

const getGithubDispatchConfig = () => {
  const token = getFirstString(process.env.GITHUB_ACTIONS_TOKEN)
  const workflowId = getFirstString(process.env.GITHUB_WORKFLOW_ID) || 'tcg-sync.yml'
  const ref = getFirstString(process.env.GITHUB_WORKFLOW_REF) || 'main'
  const { owner, name } = parseGithubRepository()

  return {
    token,
    owner,
    name,
    workflowId,
    ref,
  }
}

const resolveSyncExecutor = (provider) => {
  if (provider === 'apify') {
    return 'local'
  }

  const configured = normalizeSyncExecutor(process.env.TCG_SYNC_EXECUTOR)

  if (configured !== 'auto') {
    return configured
  }

  // In cloud runtime Instaloader defaults to workflow dispatch.
  if (process.env.VERCEL === '1') {
    return 'github'
  }

  return 'local'
}

const assertGithubDispatchConfig = (config) => {
  const missing = []

  if (!config.token) missing.push('GITHUB_ACTIONS_TOKEN')
  if (!config.owner || !config.name) missing.push('GITHUB_REPOSITORY (or GITHUB_REPO_OWNER + GITHUB_REPO_NAME)')
  if (!config.workflowId) missing.push('GITHUB_WORKFLOW_ID')

  if (missing.length > 0) {
    throw new Error(`GitHub sync dispatch is not configured. Missing: ${missing.join(', ')}`)
  }
}

const dispatchGithubWorkflow = async (config, provider) => {
  assertGithubDispatchConfig(config)

  const endpoint = `https://api.github.com/repos/${config.owner}/${config.name}/actions/workflows/${encodeURIComponent(config.workflowId)}/dispatches`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: config.ref,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Failed to dispatch GitHub workflow (${response.status}): ${details}`)
  }

  return {
    provider,
    authStatus: 'queued',
    handles: [],
    fetched: 0,
    inserted: 0,
    notified: 0,
    notificationErrors: [],
    latest: [],
    queued: true,
    trigger: 'github-actions',
    workflowUrl: `https://github.com/${config.owner}/${config.name}/actions/workflows/${encodeURIComponent(config.workflowId)}`,
  }
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
    const provider = getScraperProvider()
    const executor = resolveSyncExecutor(provider)

    if (executor === 'github') {
      const result = await dispatchGithubWorkflow(getGithubDispatchConfig(), provider)
      return res.status(202).json({ ok: true, result })
    }

    const result = await syncInstagramPosts({
      handles,
      postsPerHandle: Number.isFinite(postsPerHandle) && postsPerHandle > 0 ? postsPerHandle : undefined,
      notify,
      provider,
    })

    return res.status(200).json({ ok: true, result })
  } catch (error) {
    return res.status(500).json({
      error: 'Sync failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
