import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import NotFound from './NotFound'
import mewClaudeRelay from '../content/side-projects/mew-claude-relay.md?raw'

// Write-ups rendered verbatim from their source markdown
const POSTS: Record<string, string> = {
  'mew-claude-relay': mewClaudeRelay,
}

const SideProjectPost = () => {
  const { slug } = useParams()
  const markdown = slug ? POSTS[slug] : undefined

  if (!markdown) return <NotFound />

  return (
    <>
      <p>
        <Link to="/side-projects">← Side Projects</Link>
      </p>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _node, ...props }) => (
            <div className="table-scroll">
              <table {...props} />
            </div>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </>
  )
}

export default SideProjectPost
