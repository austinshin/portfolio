import { Link } from 'react-router-dom'
import AiToolRunner from '../components/AiToolRunner'

const DocsSummary = () => (
  <>
    <p className="small">
      <Link to="/ai-tools">← AI Tools</Link>
    </p>
    <h1>Repo Docs Summary</h1>
    <p>
      Point it at a public GitHub repo and Claude reads the file tree, README, and
      manifests, then writes a high-level overview of how the repo works — what it does,
      the tech stack, how it's organized, and how the pieces fit together.
    </p>
    <AiToolRunner
      inputLabel="GitHub repo"
      placeholder="https://github.com/owner/repo  or  owner/repo"
      buttonLabel="Analyze repo"
      endpoint="/api/ai/docs-summary"
      paramName="repo"
      downloadName="repo-overview"
      loadingMessage="Reading the repo and writing the overview — this can take a minute…"
    />
  </>
)

export default DocsSummary
