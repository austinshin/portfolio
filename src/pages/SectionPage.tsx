import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  Section,
  Post,
  getPublishedPosts,
  formatDate,
  isSupabaseConfigured,
} from '../lib/posts'

interface SectionPageProps {
  section: Section
  title: string
  /**
   * 'links' — dated list linking to detail pages;
   * 'inline' — full markdown entries on the page;
   * 'cards' — image + title grid linking to detail pages
   */
  display: 'links' | 'inline' | 'cards'
  emptyMessage?: string
}

const SectionPage = ({ section, title, display, emptyMessage }: SectionPageProps) => {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPosts(null)
    setError(null)
    getPublishedPosts(section)
      .then(setPosts)
      .catch((err) => setError(err.message))
  }, [section])

  return (
    <>
      <h1>{title}</h1>

      {!isSupabaseConfigured && (
        <p className="muted small">
          Supabase is not configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to
          your .env to load content.
        </p>
      )}

      {error && <p className="form-error">Failed to load: {error}</p>}
      {isSupabaseConfigured && !error && posts === null && <p className="muted">Loading…</p>}

      {posts !== null && posts.length === 0 && isSupabaseConfigured && (
        <p className="muted">{emptyMessage || 'Nothing here yet.'}</p>
      )}

      {posts !== null && display === 'links' && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/${section}/${post.slug}`}>{post.title}</Link>
              <span className="post-date">{formatDate(post.created_at)}</span>
            </li>
          ))}
        </ul>
      )}

      {posts !== null && display === 'cards' && posts.length > 0 && (
        <div className="card-grid">
          {posts.map((post) => (
            <Link key={post.id} to={`/${section}/${post.slug}`} className="card">
              {post.image_url ? (
                <img className="card-image" src={post.image_url} alt={post.title} loading="lazy" />
              ) : (
                <div className="card-image card-image-placeholder" aria-hidden="true">
                  🍳
                </div>
              )}
              <span className="card-title">{post.title}</span>
            </Link>
          ))}
        </div>
      )}

      {posts !== null &&
        display === 'inline' &&
        posts.map((post) => (
          <div key={post.id} className={`post-entry${post.image_url ? ' has-cover' : ''}`}>
            {post.image_url && (
              <img className="post-cover" src={post.image_url} alt={post.title} loading="lazy" />
            )}
            <div className="post-entry-body">
              <h2>{post.title}</h2>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        ))}
    </>
  )
}

export default SectionPage
