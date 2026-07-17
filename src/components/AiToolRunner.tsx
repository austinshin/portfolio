import { FormEvent, useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
}

const AiToolRunner = ({
  inputLabel,
  placeholder,
  buttonLabel,
  endpoint,
  paramName,
  downloadName,
  loadingMessage,
}: AiToolRunnerProps) => {
  const [input, setInput] = useState('')
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMarkdown(null)
    setCopied(false)
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [paramName]: input.trim() }),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.error || `Request failed with status ${resp.status}`)
      }
      setMarkdown(data.markdown)
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
        <button className="btn" type="submit" disabled={loading || !input.trim()}>
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
