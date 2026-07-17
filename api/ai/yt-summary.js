import Anthropic from '@anthropic-ai/sdk'
import { YoutubeTranscript } from 'youtube-transcript'
import { requireUser } from '../../lib/ai/auth.js'

export const config = { maxDuration: 60 }

const MAX_TRANSCRIPT_CHARS = 400_000

function formatTimestamp(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server' })
  }

  const user = await requireUser(req, res)
  if (!user) return

  const { url } = req.body || {}
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing "url" in request body' })
  }

  let segments
  try {
    segments = await YoutubeTranscript.fetchTranscript(url)
  } catch (err) {
    return res.status(422).json({
      error: `Could not fetch a transcript for that video (${err.message}). The video may not have captions enabled.`,
    })
  }

  if (!segments || segments.length === 0) {
    return res.status(422).json({ error: 'No transcript found for that video.' })
  }

  // Timestamp roughly once per minute so the summary can cite them
  let transcript = ''
  let lastStamp = -60_000
  for (const seg of segments) {
    if (seg.offset - lastStamp >= 60_000) {
      transcript += `\n[${formatTimestamp(seg.offset)}] `
      lastStamp = seg.offset
    }
    transcript += seg.text + ' '
  }
  const truncated = transcript.length > MAX_TRANSCRIPT_CHARS
  if (truncated) transcript = transcript.slice(0, MAX_TRANSCRIPT_CHARS)

  const client = new Anthropic()

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system:
        'You are an expert academic note-taker. You turn lecture transcripts into clear, well-organized study notes in markdown. ' +
        'Structure: a title, a 2-3 sentence overview, the main content organized into sections with headers that follow the flow of the lecture ' +
        '(cite the [timestamps] from the transcript at each section header), key terms/definitions where relevant, and a final "Key Takeaways" bullet list. ' +
        'Preserve concrete details — formulas, dates, names, examples — rather than vague generalities. Output only the markdown document, no preamble.',
      messages: [
        {
          role: 'user',
          content: `Create summarized study notes in markdown for this lecture transcript:\n\n${transcript}${
            truncated ? '\n\n[Transcript truncated due to length]' : ''
          }`,
        },
      ],
    })
    const message = await stream.finalMessage()

    if (message.stop_reason === 'refusal') {
      return res.status(422).json({ error: 'The model declined to summarize this content.' })
    }

    const markdown = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    return res.status(200).json({ markdown, truncated })
  } catch (err) {
    console.error('yt-summary error:', err)
    return res.status(502).json({ error: `Summarization failed: ${err.message}` })
  }
}
