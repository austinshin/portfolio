const IG_HANDLE_PATTERN = /^[a-z0-9._]+$/i

export const normalizeHandle = (value) => {
  if (typeof value !== 'string') return ''
  const normalized = value.trim().replace(/^@/, '').toLowerCase()
  if (!normalized || !IG_HANDLE_PATTERN.test(normalized)) {
    return ''
  }
  return normalized
}

export const extractHandleFromUrl = (value) => {
  if (typeof value !== 'string') return ''

  try {
    const url = new URL(value)
    if (!url.hostname.includes('instagram.com')) {
      return ''
    }

    const segment = url.pathname.split('/').filter(Boolean)[0] || ''
    if (['p', 'reel', 'tv', 'stories', 'explore'].includes(segment.toLowerCase())) {
      return ''
    }

    return normalizeHandle(segment)
  } catch {
    return ''
  }
}

export const getFirstString = (...values) => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
      continue
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return ''
}

export const toIsoDate = (...values) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      const asMillis = value < 1e12 ? value * 1000 : value
      const date = new Date(asMillis)
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString()
      }
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) continue

      const numeric = Number(trimmed)
      if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
        const asMillis = numeric < 1e12 ? numeric * 1000 : numeric
        const numericDate = new Date(asMillis)
        if (!Number.isNaN(numericDate.getTime())) {
          return numericDate.toISOString()
        }
      }

      const date = new Date(trimmed)
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString()
      }
    }
  }

  return new Date().toISOString()
}

export const clamp = (value, min, max) => {
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(value, min), max)
}
