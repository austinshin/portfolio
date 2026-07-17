const RESUME_FILE_ID = '1depxhrLL9jSSTUO5R3BaoXAzjic6GnvH'
const RESUME_VIEW_URL = `https://drive.google.com/file/d/${RESUME_FILE_ID}/view?usp=sharing`
const RESUME_EMBED_URL = `https://drive.google.com/file/d/${RESUME_FILE_ID}/preview`

const Resume = () => {
  return (
    <>
      <h1>Resume</h1>
      <p>
        <a href={RESUME_VIEW_URL} target="_blank" rel="noopener noreferrer">
          Open in Google Drive
        </a>{' '}
        <span className="muted">· if the preview doesn't load below</span>
      </p>
      <iframe
        className="resume-embed"
        src={RESUME_EMBED_URL}
        title="Austin Shin — Resume"
        allow="autoplay"
      />
    </>
  )
}

export default Resume
