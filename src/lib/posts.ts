import { supabase } from './supabaseClient'

export type Section = 'blog' | 'read' | 'reading' | 'food' | 'shows'

export const SECTIONS: { value: Section; label: string }[] = [
  { value: 'blog', label: 'Blog' },
  { value: 'read', label: 'Read' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'food', label: 'Food' },
  { value: 'shows', label: 'Shows & Movies' },
]

export interface Post {
  id: string
  title: string
  slug: string
  section: Section
  content: string
  image_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export const isSupabaseConfigured = supabase !== null

export async function getPublishedPosts(section: Section): Promise<Post[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('section', section)
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Post[]
}

export async function getPostBySlug(section: Section, slug: string): Promise<Post | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('section', section)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  return data as Post | null
}

export async function getAllPosts(): Promise<Post[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Post[]
}

export interface PostInput {
  title: string
  slug: string
  section: Section
  content: string
  image_url: string | null
  published: boolean
}

export async function createPost(input: PostInput): Promise<Post> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.from('posts').insert(input).select().single()
  if (error) throw error
  return data as Post
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('posts')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Post
}

export async function deletePost(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
