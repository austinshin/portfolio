import dotenv from 'dotenv'

let loaded = false

const loadIfExists = (path) => {
  dotenv.config({ path, override: false })
}

export const ensureServerEnv = () => {
  if (loaded) {
    return
  }

  // Local-first fallbacks for Vercel dev and direct node scripts.
  loadIfExists('.env.local')
  loadIfExists('.env')
  loadIfExists('.vercel/.env.preview.local')
  loadIfExists('.vercel/.env.development.local')

  loaded = true
}
