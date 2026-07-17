import { Link } from 'react-router-dom'

const AiTools = () => (
  <>
    <h1>AI Tools</h1>
    <p>Small tools I built that use Claude to do useful things.</p>

    <div className="item-block">
      <h3>
        <Link to="/yt-lecture-summary">YouTube Lecture Summary</Link>
      </h3>
      <p>
        Paste a YouTube link to a lecture and get structured markdown study notes —
        sections with timestamps, key terms, and takeaways — ready to copy or download.
      </p>
    </div>

    <div className="item-block">
      <h3>
        <Link to="/docs-summary">Repo Docs Summary</Link>
      </h3>
      <p>
        Give it a GitHub repo and get a high-level overview of how the codebase works:
        purpose, tech stack, structure, and how the pieces fit together.
      </p>
    </div>

    <h2>Other side projects</h2>
    <div className="item-block">
      <h3>
        <a href="/artflow">ArtFlow</a>
      </h3>
      <p>A drawing practice app with timed reference sessions.</p>
    </div>
    <div className="item-block">
      <h3>
        <a href="/tcg">TCG Dashboard</a>
      </h3>
      <p>A dashboard tracking trading card market activity from social feeds.</p>
    </div>
    <div className="item-block">
      <h3>
        <a href="/dev">Dev Environment</a>
      </h3>
      <p>My live dev-environment setup — dotfiles rendered straight from the repo.</p>
    </div>
  </>
)

export default AiTools
