import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabaseClient'
import {
  SECTIONS,
  Section,
  Post,
  PostInput,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  slugify,
  formatDate,
} from '../lib/posts'

const EMPTY_DRAFT: PostInput = {
  title: '',
  slug: '',
  section: 'blog',
  content: '',
  image_url: null,
  published: true,
}

const Admin = () => {
  const navigate = useNavigate()
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<PostInput>(EMPTY_DRAFT)
  const [slugTouched, setSlugTouched] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!supabase) {
      navigate('/login', { replace: true })
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/login', { replace: true })
      } else {
        setCheckedAuth(true)
      }
    })
  }, [navigate])

  const refresh = useCallback(() => {
    getAllPosts()
      .then(setPosts)
      .catch((err) => setStatus({ kind: 'error', text: `Failed to load posts: ${err.message}` }))
  }, [])

  useEffect(() => {
    if (checkedAuth) refresh()
  }, [checkedAuth, refresh])

  const startNew = () => {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setSlugTouched(false)
    setShowEditor(true)
    setStatus(null)
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    setDraft({
      title: post.title,
      slug: post.slug,
      section: post.section,
      content: post.content,
      image_url: post.image_url,
      published: post.published,
    })
    setSlugTouched(true)
    setShowEditor(true)
    setStatus(null)
    window.scrollTo({ top: 0 })
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const input = {
        ...draft,
        slug: draft.slug || slugify(draft.title),
        image_url: draft.image_url?.trim() || null,
      }
      if (editingId) {
        await updatePost(editingId, input)
        setStatus({ kind: 'success', text: 'Post updated.' })
      } else {
        const created = await createPost(input)
        setEditingId(created.id)
        setStatus({ kind: 'success', text: 'Post created.' })
      }
      refresh()
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingId) return
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    try {
      await deletePost(editingId)
      setShowEditor(false)
      setEditingId(null)
      setDraft(EMPTY_DRAFT)
      setStatus({ kind: 'success', text: 'Post deleted.' })
      refresh()
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Delete failed' })
    }
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    navigate('/login')
  }

  if (!checkedAuth) return <p className="muted">Checking session…</p>

  return (
    <>
      <h1>Admin</h1>
      <div className="admin-toolbar">
        <button className="btn" onClick={startNew}>
          New post
        </button>
        <button className="btn btn-secondary" onClick={handleSignOut}>
          Sign out
        </button>
        {status && (
          <span className={status.kind === 'error' ? 'form-error' : 'form-success'}>
            {status.text}
          </span>
        )}
      </div>

      {showEditor && (
        <form onSubmit={handleSave} style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit post' : 'New post'}</h2>
          <div className="form-stack" style={{ maxWidth: 'none' }}>
            <div className="editor-meta">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setDraft((d) => ({
                      ...d,
                      title,
                      slug: slugTouched ? d.slug : slugify(title),
                    }))
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="slug">Slug</label>
                <input
                  id="slug"
                  type="text"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                  }}
                />
              </div>
              <div>
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  value={draft.section}
                  onChange={(e) => setDraft((d) => ({ ...d, section: e.target.value as Section }))}
                >
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <label htmlFor="published" style={{ display: 'block' }}>
                  Published
                </label>
                <input
                  id="published"
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                  style={{ width: 'auto', marginTop: '0.75rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="image-url">Image URL (optional — book cover, show poster, etc.)</label>
              <input
                id="image-url"
                type="text"
                value={draft.image_url ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value }))}
                placeholder="https://..."
              />
              {draft.image_url?.trim() && (
                <img
                  src={draft.image_url}
                  alt="Preview"
                  style={{
                    marginTop: '0.5rem',
                    maxHeight: '8rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border)',
                  }}
                />
              )}
            </div>

            <div className="editor-grid">
              <div>
                <label htmlFor="content">Markdown</label>
                <textarea
                  id="content"
                  rows={20}
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  placeholder="Write your post in markdown…"
                />
              </div>
              <div>
                <label>Preview</label>
                <div className="editor-preview">
                  <ReactMarkdown>{draft.content || '*Nothing to preview yet.*'}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setShowEditor(false)}
              >
                Close
              </button>
              {editingId && (
                <button className="btn btn-danger" type="button" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      <h2>All posts</h2>
      {posts.length === 0 ? (
        <p className="muted">No posts yet — create your first one.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Section</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} onClick={() => startEdit(post)}>
                <td>{post.title}</td>
                <td>{SECTIONS.find((s) => s.value === post.section)?.label ?? post.section}</td>
                <td>
                  <span className={`badge${post.published ? ' published' : ''}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="muted">{formatDate(post.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default Admin
