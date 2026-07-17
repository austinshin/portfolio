import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabaseClient'

interface FallbackField {
  /** JSON field name sent alongside the main param */
  name: string
  label: string
  /** Shown above the textarea when the server asks for the fallback */
  help: string
  placeholder: string
}

interface AiToolRunnerProps {
  inputLabel: string
  placeholder: string
  buttonLabel: string
  endpoint: string
  /** Name of the JSON field the API expects, e.g. "url" or "repo" */
  paramName: string
  /** Filename (without extension) for the markdown download */
  downloadName: string
  loadingMessage: string
  /** Textarea offered when the API responds with code "transcript_unavailable" */
  fallbackField?: FallbackField
}

const AiToolRunner = ({
  inputLabel,
  placeholder,
  buttonLabel,
  endpoint,
  paramName,
  downloadName,
  loadingMessage,
  fallbackField,
}: AiToolRunnerProps) => {
  const [input, setInput] = useState('')
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [showFallback, setShowFallback] = useState(false)
  const [fallbackText, setFallbackText] = useState('')

  useEffect(() => {
    if (!supabase) {
      setSignedIn(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMarkdown(null)
    setCopied(false)
    try {
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } }
      const token = data.session?.access_token
      if (!token) {
        throw new Error('You need to be signed in to use this tool.')
      }
      const body: Record<string, string> = { [paramName]: input.trim() }
      if (fallbackField && showFallback && fallbackText.trim()) {
        body[fallbackField.name] = fallbackText.trim()
      }
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const respData = await resp.json().catch(() => null)
      if (!resp.ok) {
        if (fallbackField && respData?.code === 'transcript_unavailable') {
          setShowFallback(true)
        }
        throw new Error(respData?.error || `Request failed with status ${resp.status}`)
      }
      setMarkdown(respData.markdown)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!markdown) return
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${downloadName}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (signedIn === false) {
    return (
      <p className="muted">
        This tool calls Claude on the server, so it's for signed-in use only.{' '}
        <Link to="/login">Sign in</Link> to run it.
      </p>
    )
  }

  return (
    <>
      <form className="form-stack" style={{ maxWidth: '32rem' }} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tool-input">{inputLabel}</label>
          <input
            id="tool-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            required
          />
        </div>
        {fallbackField && showFallback && (
          <div>
            <label htmlFor="fallback-input">{fallbackField.label}</label>
            <p className="muted small" style={{ marginBottom: '0.5rem' }}>
              {fallbackField.help}
            </p>
            <textarea
              id="fallback-input"
              rows={8}
              value={fallbackText}
              onChange={(e) => setFallbackText(e.target.value)}
              placeholder={fallbackField.placeholder}
            />
          </div>
        )}
        <button
          className="btn"
          type="submit"
          disabled={loading || !input.trim() || (showFallback && !fallbackText.trim())}
        >
          {loading ? 'Working…' : buttonLabel}
        </button>
      </form>

      {loading && <p className="muted" style={{ marginTop: '1.5rem' }}>{loadingMessage}</p>}
      {error && <p className="form-error" style={{ marginTop: '1.5rem' }}>{error}</p>}

      {markdown && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button className="btn btn-secondary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy markdown'}
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              Download .md
            </button>
          </div>
          <hr />
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}
    </>
  )
}

export default AiToolRunner
