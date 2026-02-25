import { FormEvent, useEffect, useMemo, useState } from 'react'
import './TcgDashboard.css'

interface HandleRow {
  id: string
  handle: string
  is_active: boolean
  created_at: string
  last_checked_at: string | null
  last_post_at: string | null
}

interface PostRow {
  id: string
  handle: string
  caption: string | null
  permalink: string
  thumbnail_url: string | null
  media_type: string | null
  posted_at: string
  created_at: string
}

interface SyncResult {
  provider?: string
  authStatus?: string
  scrapeErrors?: Array<{ handle?: string; stage?: string; error?: string } | string>
  successHandles?: number
  totalHandles?: number
  inserted: number
  fetched: number
  notified: number
  handles?: string[]
  notificationErrors?: string[]
  latest?: unknown[]
  queued?: boolean
  trigger?: string
  workflowUrl?: string
}

const PASSWORD_STORAGE_KEY = 'tcg-dashboard-password'
const SYNC_LOG_STORAGE_KEY = 'tcg-dashboard-latest-sync-log'
type DashboardTab = 'feed' | 'logs'

interface SyncLogEntry {
  ranAt: string
  provider: string
  authStatus: string
  fetched: number
  inserted: number
  notified: number
  handles: string[]
  notificationErrors: string[]
  latestCount: number
  queued?: boolean
  trigger?: string
  workflowUrl?: string
  scrapeErrors?: string[]
  successHandles?: number
  totalHandles?: number
  failed?: boolean
  error?: string
}

const readStoredSyncLog = (): SyncLogEntry | null => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SYNC_LOG_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.ranAt !== 'string') return null

    return {
      ...(parsed as SyncLogEntry),
      authStatus: typeof parsed.authStatus === 'string' ? parsed.authStatus : 'unknown',
    }
  } catch {
    return null
  }
}

const parseResponse = async (response: Response) => {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      body?.details ||
      body?.message ||
      body?.error ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  return body
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const getNextHourlySync = (nowMs: number) => {
  const next = new Date(nowMs)
  next.setMinutes(0, 0, 0)
  if (next.getTime() <= nowMs) {
    next.setHours(next.getHours() + 1)
  }
  return next
}

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

const TcgDashboard = () => {
  const [passwordInput, setPasswordInput] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState('')

  const [handles, setHandles] = useState<HandleRow[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])
  const [newHandle, setNewHandle] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')
  const [activeTab, setActiveTab] = useState<DashboardTab>('feed')
  const [latestSyncLog, setLatestSyncLog] = useState<SyncLogEntry | null>(() => readStoredSyncLog())
  const [nowMs, setNowMs] = useState(() => Date.now())

  const isAuthed = Boolean(password)

  const activeHandlesCount = useMemo(
    () => handles.filter((handle) => handle.is_active).length,
    [handles],
  )
  const nextSyncDate = useMemo(() => getNextHourlySync(nowMs), [nowMs])
  const nextSyncClock = useMemo(
    () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(nextSyncDate),
    [nextSyncDate],
  )
  const nextSyncCountdown = useMemo(
    () => formatCountdown(nextSyncDate.getTime() - nowMs),
    [nextSyncDate, nowMs],
  )

  const secureFetch = async (url: string, init: RequestInit = {}, activePassword = password) => {
    const headers = new Headers(init.headers)
    headers.set('x-tcg-password', activePassword)

    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
      ...init,
      headers,
    })

    return parseResponse(response)
  }

  const loadHandles = async (activePassword = password) => {
    const response = await secureFetch('/api/tcg/handles', { method: 'GET' }, activePassword)
    setHandles(response.handles || [])
  }

  const loadFeed = async (activePassword = password) => {
    const response = await secureFetch('/api/tcg/feed?limit=60', { method: 'GET' }, activePassword)
    setPosts(response.posts || [])
  }

  const loadDashboardData = async (activePassword = password) => {
    setIsLoading(true)

    try {
      await Promise.all([loadHandles(activePassword), loadFeed(activePassword)])
      setStatusError('')
    } finally {
      setIsLoading(false)
    }
  }

  const authenticate = async (attemptedPassword: string, fromStorage = false) => {
    setIsAuthenticating(true)
    setAuthError('')
    setStatusMessage('')

    try {
      await secureFetch(
        '/api/tcg/auth',
        {
          method: 'POST',
          body: JSON.stringify({ password: attemptedPassword }),
        },
        attemptedPassword,
      )

      sessionStorage.setItem(PASSWORD_STORAGE_KEY, attemptedPassword)
      setPassword(attemptedPassword)
      setPasswordInput('')

      setStatusMessage('Access granted.')
      try {
        await loadDashboardData(attemptedPassword)
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Unable to load dashboard data.')
      }
    } catch (error) {
      if (fromStorage) {
        sessionStorage.removeItem(PASSWORD_STORAGE_KEY)
      }

      setAuthError(error instanceof Error ? error.message : 'Authentication failed.')
      setPassword('')
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    const storedPassword = sessionStorage.getItem(PASSWORD_STORAGE_KEY)
    if (storedPassword) {
      void authenticate(storedPassword, true)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const attemptedPassword = passwordInput.trim()

    if (!attemptedPassword) {
      setAuthError('Password is required.')
      return
    }

    await authenticate(attemptedPassword)
  }

  const handleAddHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusError('')
    setStatusMessage('')

    const handle = newHandle.trim()
    if (!handle) {
      setStatusError('Enter an Instagram handle first.')
      return
    }

    try {
      await secureFetch('/api/tcg/handles', {
        method: 'POST',
        body: JSON.stringify({ handle }),
      })

      setNewHandle('')
      setStatusMessage(`Tracking @${handle.replace(/^@/, '')}.`)
      await loadDashboardData()
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to add handle.')
    }
  }

  const handleRemoveHandle = async (handle: string) => {
    setStatusError('')
    setStatusMessage('')

    try {
      await secureFetch(`/api/tcg/handles?handle=${encodeURIComponent(handle)}`, {
        method: 'DELETE',
      })

      setStatusMessage(`Stopped tracking @${handle}.`)
      await loadDashboardData()
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to remove handle.')
    }
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    setStatusError('')
    setStatusMessage('')

    try {
      const response = await secureFetch('/api/tcg/sync', {
        method: 'POST',
        body: JSON.stringify({ notify: true }),
      })

      const result = response.result as SyncResult
      const inserted = result?.inserted ?? 0
      const fetched = result?.fetched ?? 0
      const notified = result?.notified ?? 0
      const syncedWith = result?.provider || 'instaloader'
      const authStatus = result?.authStatus || 'unknown'
      const queued = Boolean(result?.queued)
      const workflowUrl = typeof result?.workflowUrl === 'string' ? result.workflowUrl : ''
      const trigger = typeof result?.trigger === 'string' ? result.trigger : ''
      const scrapeErrors = Array.isArray(result?.scrapeErrors)
        ? result.scrapeErrors.map((entry) => {
          if (!entry || typeof entry !== 'object') {
            return String(entry)
          }

          const handle = typeof entry.handle === 'string' && entry.handle ? `@${entry.handle}` : '@unknown'
          const stage = typeof entry.stage === 'string' && entry.stage ? `[${entry.stage}] ` : ''
          const error = typeof entry.error === 'string' && entry.error ? entry.error : JSON.stringify(entry)
          return `${handle} ${stage}${error}`
        })
        : []
      const successHandles = Number.isFinite(result?.successHandles) ? Number(result.successHandles) : 0
      const totalHandles = Number.isFinite(result?.totalHandles) ? Number(result.totalHandles) : 0
      const logEntry: SyncLogEntry = {
        ranAt: new Date().toISOString(),
        provider: syncedWith,
        authStatus,
        fetched,
        inserted,
        notified,
        handles: Array.isArray(result?.handles) ? result.handles : [],
        notificationErrors: Array.isArray(result?.notificationErrors) ? result.notificationErrors : [],
        latestCount: Array.isArray(result?.latest) ? result.latest.length : 0,
        queued,
        workflowUrl,
        trigger,
        scrapeErrors,
        successHandles,
        totalHandles,
      }

      setLatestSyncLog(logEntry)
      window.localStorage.setItem(SYNC_LOG_STORAGE_KEY, JSON.stringify(logEntry))

      if (queued) {
        const message = workflowUrl
          ? `Sync queued via GitHub Actions. Track run: ${workflowUrl}`
          : 'Sync queued via GitHub Actions.'
        setStatusMessage(message)
      } else {
        setStatusMessage(`Sync complete via ${syncedWith}. Fetched ${fetched}, inserted ${inserted}, notified ${notified}.`)
        await loadDashboardData()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Manual sync failed.'
      const failedLogEntry: SyncLogEntry = {
        ranAt: new Date().toISOString(),
        provider: 'instaloader',
        authStatus: 'unknown',
        fetched: 0,
        inserted: 0,
        notified: 0,
        handles: handles.map((handle) => handle.handle),
        notificationErrors: [],
        latestCount: 0,
        failed: true,
        error: message,
      }
      setLatestSyncLog(failedLogEntry)
      window.localStorage.setItem(SYNC_LOG_STORAGE_KEY, JSON.stringify(failedLogEntry))
      setStatusError(message)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleRefresh = async () => {
    setStatusError('')
    setStatusMessage('Refreshing...')

    try {
      await loadDashboardData()
      setStatusMessage('Feed refreshed.')
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Failed to refresh feed.')
    }
  }

  const handleClearFeed = async () => {
    const confirmed = window.confirm(
      'Clear all currently visible posts for active handles? This deletes them from storage.',
    )

    if (!confirmed) {
      return
    }

    setIsClearing(true)
    setStatusError('')
    setStatusMessage('')

    try {
      const response = await secureFetch('/api/tcg/feed', { method: 'DELETE' })
      const deleted = Number(response.deleted || 0)
      setStatusMessage(`Cleared ${deleted} posts.`)
      await loadDashboardData()
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Failed to clear feed.')
    } finally {
      setIsClearing(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY)
    setPassword('')
    setPasswordInput('')
    setHandles([])
    setPosts([])
    setStatusMessage('')
    setStatusError('')
  }

  if (!isAuthed) {
    return (
      <main className="tcg-page">
        <section className="tcg-lock-card">
          <p className="tcg-kicker">Private Feed</p>
          <h1>TCG Dashboard</h1>
          <p className="tcg-subtitle">
            Enter the shared password to view and manage the Instagram post feed.
          </p>

          <form className="tcg-lock-form" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              disabled={isAuthenticating}
            />
            <button type="submit" disabled={isAuthenticating}>
              {isAuthenticating ? 'Checking...' : 'Enter'}
            </button>
          </form>

          {authError && <p className="tcg-error">{authError}</p>}
        </section>
      </main>
    )
  }

  return (
    <main className="tcg-page">
      <section className="tcg-shell">
        <header className="tcg-header">
          <div>
            <p className="tcg-kicker">austinshin.io/tcg</p>
            <h1>Instagram Feed Console</h1>
            <p className="tcg-sync-timer">
              Next hourly cron sync: <strong>{nextSyncClock}</strong> (in {nextSyncCountdown})
            </p>
          </div>
          <div className="tcg-header-actions">
            <button type="button" onClick={handleRefresh} disabled={isLoading || isSyncing || isClearing}>
              Refresh
            </button>
            <button type="button" onClick={handleManualSync} disabled={isSyncing || isClearing}>
              {isSyncing ? 'Syncing...' : 'Run Sync'}
            </button>
            <button type="button" className="danger" onClick={handleClearFeed} disabled={isSyncing || isClearing}>
              {isClearing ? 'Clearing...' : 'Clear'}
            </button>
            <button type="button" className="danger" onClick={handleLogout}>
              Lock
            </button>
          </div>
        </header>

        <div className="tcg-layout">
          <aside className="tcg-sidebar">
            <article className="tcg-panel">
              <h2>Tracked Handles</h2>
              <p className="tcg-stat">{activeHandlesCount}</p>
              <p className="tcg-muted">Active accounts monitored by cron sync.</p>
            </article>

            <article className="tcg-panel">
              <h2>Scraper Provider</h2>
              <p className="tcg-muted">Instaloader (fixed)</p>
            </article>

            <article className="tcg-panel">
              <h2>Add Handle</h2>
              <form className="tcg-handle-form" onSubmit={handleAddHandle}>
                <input
                  type="text"
                  value={newHandle}
                  onChange={(event) => setNewHandle(event.target.value)}
                  placeholder="@example"
                  aria-label="Instagram handle"
                />
                <button type="submit">Add</button>
              </form>
            </article>

            <article className="tcg-panel tcg-handle-list-panel">
              <h2>Current List</h2>
              {handles.length === 0 && <p className="tcg-muted">No handles added yet.</p>}
              {handles.map((handle) => (
                <div className="tcg-handle-row" key={handle.id}>
                  <div>
                    <p className="tcg-handle-name">@{handle.handle}</p>
                    <p className="tcg-muted small">
                      Last post: {handle.last_post_at ? formatDate(handle.last_post_at) : 'n/a'}
                    </p>
                  </div>
                  <button type="button" className="danger ghost" onClick={() => handleRemoveHandle(handle.handle)}>
                    Remove
                  </button>
                </div>
              ))}
            </article>
          </aside>

          <section className="tcg-feed">
            <div className="tcg-feed-header">
              <div className="tcg-view-tabs">
                <button
                  type="button"
                  className={`tcg-view-tab ${activeTab === 'feed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('feed')}
                >
                  Feed
                </button>
                <button
                  type="button"
                  className={`tcg-view-tab ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  Logs
                </button>
              </div>
              {activeTab === 'feed' ? <p>{posts.length} items</p> : <p>Latest sync</p>}
            </div>

            {activeTab === 'feed' ? (
              <>
                {isLoading && posts.length === 0 && <p className="tcg-muted">Loading feed...</p>}
                {!isLoading && posts.length === 0 && <p className="tcg-muted">No posts yet. Run sync to fetch data.</p>}

                <div className="tcg-feed-list">
                  {posts.map((post) => (
                    <article className="tcg-post" key={post.id}>
                      <div className="tcg-post-media">
                        {post.thumbnail_url ? (
                          <img src={post.thumbnail_url} alt={`@${post.handle} post`} loading="lazy" />
                        ) : (
                          <div className="tcg-media-placeholder">@{post.handle}</div>
                        )}
                      </div>

                      <div className="tcg-post-content">
                        <div className="tcg-post-meta">
                          <strong>@{post.handle}</strong>
                          <span>{formatDate(post.posted_at)}</span>
                        </div>
                        <p className="tcg-post-caption">{post.caption || 'No caption available.'}</p>
                        <a href={post.permalink} target="_blank" rel="noreferrer">
                          Open on Instagram
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="tcg-log-view">
                {!latestSyncLog && <p className="tcg-muted">No sync log yet. Run sync to generate one.</p>}
                {latestSyncLog && (
                  <article className="tcg-log-card">
                    <div className="tcg-log-grid">
                      <div className="tcg-log-row">
                        <span>Ran At</span>
                        <strong>{formatDate(latestSyncLog.ranAt)}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Provider</span>
                        <strong>{latestSyncLog.provider}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Auth Status</span>
                        <strong>{latestSyncLog.authStatus}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Fetched</span>
                        <strong>{latestSyncLog.fetched}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Inserted</span>
                        <strong>{latestSyncLog.inserted}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Notified</span>
                        <strong>{latestSyncLog.notified}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Latest Saved</span>
                        <strong>{latestSyncLog.latestCount}</strong>
                      </div>
                      <div className="tcg-log-row">
                        <span>Queued</span>
                        <strong>{latestSyncLog.queued ? 'yes' : 'no'}</strong>
                      </div>
                    </div>

                    {latestSyncLog.trigger && (
                      <>
                        <p className="tcg-log-label">Trigger</p>
                        <p className="tcg-log-value">{latestSyncLog.trigger}</p>
                      </>
                    )}

                    {latestSyncLog.workflowUrl && (
                      <>
                        <p className="tcg-log-label">Workflow</p>
                        <p className="tcg-log-value">
                          <a href={latestSyncLog.workflowUrl} target="_blank" rel="noreferrer">
                            Open GitHub Actions
                          </a>
                        </p>
                      </>
                    )}

                    <p className="tcg-log-label">Handles</p>
                    <p className="tcg-log-value">
                      {latestSyncLog.handles.length > 0
                        ? latestSyncLog.handles.map((handle) => `@${handle}`).join(', ')
                        : 'n/a'}
                    </p>

                    {latestSyncLog.failed && latestSyncLog.error && (
                      <>
                        <p className="tcg-log-label error">Failure</p>
                        <p className="tcg-log-value error">{latestSyncLog.error}</p>
                      </>
                    )}

                    {latestSyncLog.notificationErrors.length > 0 && (
                      <>
                        <p className="tcg-log-label error">Notification Errors</p>
                        <ul className="tcg-log-errors">
                          {latestSyncLog.notificationErrors.map((error, index) => (
                            <li key={`${error}-${index}`}>{error}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {latestSyncLog.totalHandles !== undefined && latestSyncLog.totalHandles > 0 && (
                      <>
                        <p className="tcg-log-label">Scrape Coverage</p>
                        <p className="tcg-log-value">
                          {latestSyncLog.successHandles || 0}/{latestSyncLog.totalHandles} handles succeeded
                        </p>
                      </>
                    )}

                    {latestSyncLog.scrapeErrors && latestSyncLog.scrapeErrors.length > 0 && (
                      <>
                        <p className="tcg-log-label error">Scrape Errors</p>
                        <ul className="tcg-log-errors">
                          {latestSyncLog.scrapeErrors.map((error, index) => (
                            <li key={`${error}-${index}`}>{error}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </article>
                )}
              </div>
            )}
          </section>
        </div>

        {statusMessage && <p className="tcg-status">{statusMessage}</p>}
        {statusError && <p className="tcg-error">{statusError}</p>}
      </section>
    </main>
  )
}

export default TcgDashboard
