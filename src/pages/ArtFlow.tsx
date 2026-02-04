import { useEffect } from 'react'

const ArtFlow = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 0,
      }}
    >
      <iframe
        title="ArtFlow"
        src="/artflow/index.html"
        style={{ width: '100%', height: '100%', border: 0 }}
        allow="fullscreen"
      />
    </div>
  )
}

export default ArtFlow
