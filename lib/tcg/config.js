import {
  DEFAULT_POSTS_PER_HANDLE,
  DEFAULT_TCG_PAGE_PASSWORD,
  MAX_POSTS_PER_HANDLE,
} from './constants.js'
import { ensureServerEnv } from './env.js'
import { clamp } from './utils.js'

ensureServerEnv()

export const getTcgPagePassword = () => process.env.TCG_PAGE_PASSWORD || DEFAULT_TCG_PAGE_PASSWORD

export const getPostsPerHandle = () => {
  const value = Number(process.env.TCG_POSTS_PER_HANDLE || DEFAULT_POSTS_PER_HANDLE)
  return clamp(value, 1, MAX_POSTS_PER_HANDLE)
}
