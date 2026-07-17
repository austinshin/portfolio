import { Link } from 'react-router-dom'
import AiToolRunner from '../components/AiToolRunner'

const YtLectureSummary = () => (
  <>
    <p className="small">
      <Link to="/ai-tools">← AI Tools</Link>
    </p>
    <h1>YouTube Lecture Summary</h1>
    <p>
      Paste a link to a school lecture (or any talk) on YouTube. The transcript is pulled
      and Claude turns it into structured study notes in markdown — with sections,
      timestamps, key terms, and takeaways — that you can copy or download.
    </p>
    <AiToolRunner
      inputLabel="YouTube URL"
      placeholder="https://www.youtube.com/watch?v=..."
      buttonLabel="Summarize lecture"
      endpoint="/api/ai/yt-summary"
      paramName="url"
      downloadName="lecture-notes"
      loadingMessage="Fetching the transcript and writing your notes — this can take a minute for long lectures…"
    />
    <p className="muted small" style={{ marginTop: '2rem' }}>
      Note: the video needs captions (auto-generated is fine) for this to work.
    </p>
  </>
)

export default YtLectureSummary
