import {
  DEFAULT_POSTS_PER_HANDLE,
  DEFAULT_TCG_PAGE_PASSWORD,
  MAX_POSTS_PER_HANDLE,
} from './constants.js'
import { ensureServerEnv } from './env.js'
import { clamp, getFirstString } from './utils.js'

ensureServerEnv()

export const getTcgPagePassword = () => process.env.TCG_PAGE_PASSWORD || DEFAULT_TCG_PAGE_PASSWORD

export const getScraperProvider = () => {
  const provider = getFirstString(process.env.TCG_SCRAPER_PROVIDER).toLowerCase()
  return provider === 'instaloader' ? 'instaloader' : 'apify'
}

export const getApifyActorId = () =>
  getFirstString(process.env.APIFY_ACTOR_ID) || 'apify~instagram-scraper'

export const getPostsPerHandle = () => {
  const value = Number(process.env.TCG_POSTS_PER_HANDLE || DEFAULT_POSTS_PER_HANDLE)
  return clamp(value, 1, MAX_POSTS_PER_HANDLE)
}
