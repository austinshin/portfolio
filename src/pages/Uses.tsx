import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ExternalLink, FileCode } from 'lucide-react'
import './Uses.css'

const REPO = 'austinshin/dotfiles'
const BRANCH = 'main'
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`
const TREE_URL = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`

// Repo meta files that aren't configs to showcase.
const EXCLUDE = new Set(['README.md', 'CLAUDE.md', 'LICENSE', '.gitignore'])

interface ConfigMeta {
  title: string
  target: string
  blurb?: string
}

// Curated labels for known config folders. Unknown folders fall back to sensible defaults,
// so adding a new folder to the dotfiles repo makes it appear here automatically.
const META: Record<string, ConfigMeta> = {
  claude: {
    title: 'Claude Code',
    target: '~/.claude/settings.json',
    blurb: 'AI coding agent — enabled plugins, theme, and permission defaults.',
  },
  alacritty: {
    title: 'Alacritty',
    target: 'Windows: %APPDATA%\\alacritty\\alacritty.toml  ·  macOS/Linux: ~/.config/alacritty/alacritty.toml',
    blurb: 'GPU-accelerated terminal emulator.',
  },
}

interface TreeNode {
  path: string
  type: string
}

interface ConfigFile {
  path: string
  folder: string
  lang: string
  content: string
  meta: ConfigMeta
  plugins?: string[]
}

type LoadStatus = 'loading' | 'ready' | 'error'

const LANG_BY_EXT: Record<string, string> = {
  toml: 'TOML',
  json: 'JSON',
  lua: 'Lua',
  vim: 'VimL',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  yml: 'YAML',
  yaml: 'YAML',
  conf: 'Conf',
  ini: 'INI',
}

const langForFile = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  return LANG_BY_EXT[ext] ?? ext.toUpperCase()
}

const titleCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

// Pull the enabled plugin names out of a Claude Code settings.json for a friendly badge list.
const parseEnabledPlugins = (content: string): string[] | undefined => {
  try {
    const json = JSON.parse(content) as { enabledPlugins?: Record<string, boolean> }
    const enabled = json.enabledPlugins
    if (!enabled) return undefined
    return Object.keys(enabled)
      .filter((key) => enabled[key])
      .map((key) => key.split('@')[0])
  } catch {
    return undefined
  }
}

const Uses = () => {
  const [configs, setConfigs] = useState<ConfigFile[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const treeRes = await fetch(TREE_URL)
        if (!treeRes.ok) throw new Error(`tree request failed: ${treeRes.status}`)
        const tree = (await treeRes.json()) as { tree?: TreeNode[] }

        const paths = (tree.tree ?? [])
          .filter((node) => node.type === 'blob' && node.path.includes('/') && !EXCLUDE.has(node.path))
          .map((node) => node.path)

        const files = await Promise.all(
          paths.map(async (path): Promise<ConfigFile> => {
            const res = await fetch(`${RAW_BASE}/${path}`)
            const content = res.ok ? await res.text() : `# Failed to load ${path}`
            const folder = path.split('/')[0]
            return {
              path,
              folder,
              lang: langForFile(path),
              content,
              meta: META[folder] ?? { title: titleCase(folder), target: path },
              plugins: parseEnabledPlugins(content),
            }
          }),
        )

        files.sort((a, b) => a.folder.localeCompare(b.folder))

        if (!cancelled) {
          setConfigs(files)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const copyConfig = async (cfg: ConfigFile) => {
    await navigator.clipboard.writeText(cfg.content)
    setCopiedPath(cfg.path)
    setTimeout(() => setCopiedPath((current) => (current === cfg.path ? null : current)), 1500)
  }

  return (
    <div className="page uses-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>DEV ENVIRONMENT</h1>
        <div className="header-line"></div>
        <p className="subtitle">
          My real dotfiles, pulled live from{' '}
          <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">
            github.com/{REPO}
          </a>
          . I update the repo, this page updates itself.
        </p>
      </motion.div>

      {status === 'loading' && <p className="uses-status">Loading configs from GitHub…</p>}

      {status === 'error' && (
        <p className="uses-status">
          Couldn&apos;t reach GitHub right now. Browse the configs directly at{' '}
          <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">
            the dotfiles repo
          </a>
          .
        </p>
      )}

      <div className="uses-list">
        {configs.map((cfg, index) => (
          <motion.section
            key={cfg.path}
            className="config-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <div className="config-head">
              <div className="config-title">
                <FileCode size={22} className="config-file-icon" />
                <div>
                  <h2>{cfg.meta.title}</h2>
                  <span className="config-path">{cfg.meta.target}</span>
                </div>
              </div>
              <div className="config-actions">
                <span className="lang-badge">{cfg.lang}</span>
                <button className="config-btn" onClick={() => copyConfig(cfg)}>
                  {copiedPath === cfg.path ? <Check size={15} /> : <Copy size={15} />}
                  {copiedPath === cfg.path ? 'Copied' : 'Copy'}
                </button>
                <a
                  className="config-btn"
                  href={`https://github.com/${REPO}/blob/${BRANCH}/${cfg.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={15} /> GitHub
                </a>
              </div>
            </div>

            {cfg.meta.blurb && <p className="config-blurb">{cfg.meta.blurb}</p>}

            {cfg.plugins && cfg.plugins.length > 0 && (
              <div className="plugin-tags">
                <span className="plugin-tags-label">Enabled plugins</span>
                <div className="plugin-tags-row">
                  {cfg.plugins.map((plugin) => (
                    <span key={plugin} className="tag">
                      {plugin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <pre className="config-code">
              <code>{cfg.content.replace(/\s+$/, '')}</code>
            </pre>
          </motion.section>
        ))}
      </div>
    </div>
  )
}

export default Uses
