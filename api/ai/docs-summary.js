import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

const MAX_TREE_ENTRIES = 600
const MAX_FILE_CHARS = 30_000
const MAX_DIGEST_CHARS = 300_000

// Root-level manifest/config files worth feeding to the model when present
const KEY_FILES = [
  'package.json',
  'pyproject.toml',
  'requirements.txt',
  'go.mod',
  'Cargo.toml',
  'composer.json',
  'Gemfile',
  'pom.xml',
  'build.gradle',
  'Makefile',
  'docker-compose.yml',
  'Dockerfile',
  'vercel.json',
  'tsconfig.json',
]

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-docs-summary',
  }
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACTIONS_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function gh(path) {
  const resp = await fetch(`https://api.github.com${path}`, { headers: githubHeaders() })
  if (!resp.ok) {
    const detail = resp.status === 403 ? ' (GitHub rate limit — set GITHUB_TOKEN)' : ''
    throw new Error(`GitHub API ${resp.status} on ${path}${detail}`)
  }
  return resp.json()
}

async function ghRaw(owner, repo, branch, path) {
  const resp = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
    { headers: { 'User-Agent': 'portfolio-docs-summary' } }
  )
  if (!resp.ok) return null
  const text = await resp.text()
  return text.slice(0, MAX_FILE_CHARS)
}

function parseRepoInput(input) {
  const trimmed = input.trim()
  const urlMatch = trimmed.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') }
  const shortMatch = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/)
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server' })
  }

  const { repo: repoInput } = req.body || {}
  if (!repoInput || typeof repoInput !== 'string') {
    return res.status(400).json({ error: 'Missing "repo" in request body' })
  }

  const parsed = parseRepoInput(repoInput)
  if (!parsed) {
    return res.status(400).json({
      error: 'Could not parse that as a GitHub repo. Use a URL like https://github.com/owner/repo or owner/repo.',
    })
  }
  const { owner, repo } = parsed

  let digest = ''
  try {
    const meta = await gh(`/repos/${owner}/${repo}`)
    const branch = meta.default_branch

    digest += `# Repository: ${meta.full_name}\n`
    digest += `Description: ${meta.description || '(none)'}\n`
    digest += `Primary language: ${meta.language || 'unknown'} | Stars: ${meta.stargazers_count} | Forks: ${meta.forks_count}\n`
    digest += `Topics: ${(meta.topics || []).join(', ') || '(none)'}\n\n`

    const tree = await gh(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
    const paths = tree.tree.filter((t) => t.type === 'blob').map((t) => t.path)
    digest += `## File tree (${paths.length} files${tree.truncated ? ', truncated by GitHub' : ''})\n`
    digest += paths.slice(0, MAX_TREE_ENTRIES).join('\n')
    if (paths.length > MAX_TREE_ENTRIES) digest += `\n... and ${paths.length - MAX_TREE_ENTRIES} more files`
    digest += '\n\n'

    const readmePath = paths.find((p) => /^readme\.(md|rst|txt)$/i.test(p)) || paths.find((p) => /^readme$/i.test(p))
    if (readmePath) {
      const readme = await ghRaw(owner, repo, branch, readmePath)
      if (readme) digest += `## ${readmePath}\n${readme}\n\n`
    }

    const present = KEY_FILES.filter((f) => paths.includes(f))
    for (const file of present) {
      if (digest.length > MAX_DIGEST_CHARS) break
      const content = await ghRaw(owner, repo, branch, file)
      if (content) digest += `## ${file}\n\`\`\`\n${content}\n\`\`\`\n\n`
    }

    digest = digest.slice(0, MAX_DIGEST_CHARS)
  } catch (err) {
    return res.status(422).json({ error: `Could not analyze the repo: ${err.message}` })
  }

  const client = new Anthropic()

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system:
        'You are a senior engineer writing an onboarding overview of a codebase for a new contributor. ' +
        'From the repository digest provided (metadata, file tree, README, manifests), produce a high-level markdown overview: ' +
        'what the project does, the tech stack, how the repo is organized (key directories and what lives in each), ' +
        'how the main pieces fit together at runtime, entry points, and how to run it locally if that is inferable. ' +
        'Ground every claim in the provided digest — if something is not determinable from it, say so briefly rather than guessing. ' +
        'Output only the markdown document, no preamble.',
      messages: [
        { role: 'user', content: `Analyze this repository and write the high-level overview:\n\n${digest}` },
      ],
    })
    const message = await stream.finalMessage()

    if (message.stop_reason === 'refusal') {
      return res.status(422).json({ error: 'The model declined to analyze this repository.' })
    }

    const markdown = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    return res.status(200).json({ markdown })
  } catch (err) {
    console.error('docs-summary error:', err)
    return res.status(502).json({ error: `Analysis failed: ${err.message}` })
  }
}
