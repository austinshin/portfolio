// Seeds the Read section with books, fetching covers from Open Library.
// Usage: node scripts/seed-books.mjs   (requires .env with Supabase service key)
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const BOOKS = [
  { title: 'Overcoming Gravity: A Systematic Approach to Gymnastics and Bodyweight Strength', author: 'Steven Low', tags: 'Fitness, Strength Training' },
  { title: "Ender's Game", author: 'Orson Scott Card', tags: 'Sci-Fi' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', tags: 'Sci-Fi, Dystopian' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', tags: 'Psychology' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', tags: 'Finance, Psychology' },
  { title: 'Best Loser Wins: Why Normal Thinking Never Wins the Trading Game', author: 'Tom Hougaard', tags: 'Trading, Psychology' },
  { title: "Don't Believe Everything You Think", author: 'Joseph Nguyen', tags: 'Self-Help, Psychology' },
  { title: 'Red Rising', author: 'Pierce Brown', tags: 'Sci-Fi' },
  { title: '12 Rules for Life: An Antidote to Chaos', author: 'Jordan B. Peterson', tags: 'Self-Help, Philosophy' },
  { title: 'World War Z: An Oral History of the Zombie War', author: 'Max Brooks', tags: 'Horror, Sci-Fi' },
  { title: 'Trading in the Zone', author: 'Mark Douglas', tags: 'Trading, Psychology' },
  { title: 'Technical Analysis of the Financial Markets', author: 'John J. Murphy', tags: 'Trading, Finance' },
  { title: 'Children of Time', author: 'Adrian Tchaikovsky', tags: 'Sci-Fi' },
  { title: 'Reminiscences of a Stock Operator', author: 'Edwin Lefèvre', tags: 'Trading, Biography' },
  { title: 'Maps of Meaning: The Architecture of Belief', author: 'Jordan B. Peterson', tags: 'Psychology, Philosophy' },
  { title: 'The Self-Coached Climber: The Guide to Movement', author: 'Dan M. Hague', tags: 'Climbing, Fitness' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', tags: 'Fantasy' },
  { title: 'The Godfather', author: 'Mario Puzo', tags: 'Crime, Fiction' },
  { title: 'Steve Jobs', author: 'Walter Isaacson', tags: 'Biography' },
  { title: 'Freakonomics', author: 'Steven D. Levitt', tags: 'Economics' },
]

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

async function findCover(title, author) {
  try {
    const q = new URLSearchParams({ title, author, limit: '1', fields: 'cover_i' })
    const resp = await fetch(`https://openlibrary.org/search.json?${q}`, {
      headers: { 'User-Agent': 'portfolio-seed (shinaustin@gmail.com)' },
    })
    if (!resp.ok) return null
    const data = await resp.json()
    const coverId = data.docs?.[0]?.cover_i
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null
  } catch {
    return null
  }
}

const admin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Insert in reverse so the page (newest first) shows the list in the order above
for (const book of [...BOOKS].reverse()) {
  const slug = slugify(book.title)
  const { data: existing } = await admin.from('posts').select('id').eq('section', 'read').eq('slug', slug).maybeSingle()
  if (existing) {
    console.log(`skip (exists): ${book.title}`)
    continue
  }
  const image_url = await findCover(book.title, book.author)
  const { error } = await admin.from('posts').insert({
    title: book.title,
    slug,
    section: 'read',
    content: '',
    author: book.author,
    tags: book.tags,
    image_url,
    published: true,
  })
  console.log(error ? `FAILED: ${book.title} — ${error.message}` : `added: ${book.title} ${image_url ? '(cover ✓)' : '(no cover)'}`)
}
console.log('done')
