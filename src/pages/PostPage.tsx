import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Section, Post, getPostBySlug, formatDate } from '../lib/posts'

interface PostPageProps {
  section: Section
  backLabel: string
}

const PostPage = ({ section, backLabel }: PostPageProps) => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')

  useEffect(() => {
    if (!slug) return
    setState('loading')
    getPostBySlug(section, slug)
      .then((p) => {
        setPost(p)
        setState(p ? 'ready' : 'missing')
        if (p) document.title = `${p.title} — Austin Shin`
      })
      .catch(() => setState('error'))
  }, [section, slug])

  if (state === 'loading') return <p className="muted">Loading…</p>
  if (state === 'error') return <p className="form-error">Failed to load this post.</p>
  if (state === 'missing' || !post)
    return (
      <>
        <h1>Not found</h1>
        <p>
          This post doesn't exist. <Link to={`/${section}`}>{backLabel}</Link>
        </p>
      </>
    )

  return (
    <>
      <p className="small">
        <Link to={`/${section}`}>← {backLabel}</Link>
      </p>
      <h1>{post.title}</h1>
      <p className="muted small">{formatDate(post.created_at)}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} loading="lazy" />}
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </>
  )
}

export default PostPage
