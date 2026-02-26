import { getFirstString } from './utils.js'
import { ensureServerEnv } from './env.js'

ensureServerEnv()

const trimCaption = (caption) => {
  const normalized = getFirstString(caption).replace(/\s+/g, ' ').trim()
  if (!normalized) return 'No caption'

  return normalized.length > 220 ? `${normalized.slice(0, 217)}...` : normalized
}

const formatUtcDate = (value) => {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) {
    return 'n/a'
  }

  return `${new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)} UTC`
}

const createMessage = (post) => {
  const handle = post.handle ? `@${post.handle}` : '@unknown'
  const caption = trimCaption(post.caption)
  const permalink = getFirstString(post.permalink)
  const postDate = formatUtcDate(post.posted_at)
  const syncedAt = formatUtcDate()

  return `New Instagram post from ${handle}\nPost Date: ${postDate}\nSynced At: ${syncedAt}\n${caption}\n${permalink}`
}

const sendDiscordNotification = async (webhookUrl, post) => {
  const payload = {
    content: `New post from @${post.handle}`,
    embeds: [
      {
        title: `@${post.handle}`,
        description: trimCaption(post.caption),
        url: post.permalink,
        image: post.thumbnail_url ? { url: post.thumbnail_url } : undefined,
        timestamp: post.posted_at,
      },
    ],
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Discord webhook failed with status ${response.status}: ${body}`)
  }
}

const sendTelegramNotification = async (botToken, chatId, post) => {
  const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`
  return sendTelegramMessage(endpoint, {
    chat_id: chatId,
    text: createMessage(post),
    disable_web_page_preview: false,
  })
}

const sendTelegramMessage = async (endpoint, payload) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Telegram notification failed with status ${response.status}: ${body}`)
  }
}

export const sendTelegramTestNotification = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.')
  }

  const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`
  const sentAt = formatUtcDate()
  const payload = {
    chat_id: chatId,
    text: `TCG Telegram test message\nSent At: ${sentAt}\nIf you see this, Telegram notifications are configured correctly.`,
    disable_web_page_preview: false,
  }

  await sendTelegramMessage(endpoint, payload)
  return { ok: true, sentAt }
}

const truncate = (value, maxLength) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength - 3)}...`
}

const createSyncSummaryMessage = ({
  provider,
  authStatus,
  handles,
  fetched,
  inserted,
  newPosts,
}) => {
  const syncedAt = formatUtcDate()
  const normalizedProvider = getFirstString(provider) || 'unknown'
  const normalizedAuthStatus = getFirstString(authStatus) || 'unknown'
  const handleCount = Array.isArray(handles) ? handles.length : 0
  const fetchedCount = Number.isFinite(fetched) ? fetched : 0
  const insertedCount = Number.isFinite(inserted) ? inserted : 0
  const posts = Array.isArray(newPosts) ? newPosts : []
  const listed = posts.slice(0, 10)

  const lines = [
    'TCG sync ran',
    `Synced At: ${syncedAt}`,
    `Provider: ${normalizedProvider}`,
    `Auth: ${normalizedAuthStatus}`,
    `Handles: ${handleCount}`,
    `Fetched: ${fetchedCount}`,
    `New posts: ${insertedCount}`,
  ]

  if (insertedCount <= 0) {
    lines.push('No new posts found.')
    return lines.join('\n')
  }

  lines.push('New posts:')
  for (const [index, post] of listed.entries()) {
    const handle = getFirstString(post?.handle) || 'unknown'
    const permalink = getFirstString(post?.permalink)
    const caption = truncate(getFirstString(post?.caption), 100)
    lines.push(`${index + 1}. @${handle}${caption ? ` - ${caption}` : ''}`)
    if (permalink) {
      lines.push(permalink)
    }
  }

  if (posts.length > listed.length) {
    lines.push(`+${posts.length - listed.length} more new posts`)
  }

  return lines.join('\n')
}

export const sendTelegramSyncSummary = async ({
  provider,
  authStatus,
  handles,
  fetched,
  inserted,
  newPosts,
}) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return {
      sent: 0,
      errors: [],
    }
  }

  try {
    const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`
    const text = createSyncSummaryMessage({
      provider,
      authStatus,
      handles,
      fetched,
      inserted,
      newPosts,
    })

    await sendTelegramMessage(endpoint, {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    })

    return {
      sent: 1,
      errors: [],
    }
  } catch (error) {
    return {
      sent: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

export const notifyNewPosts = async (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return {
      sent: 0,
      errors: [],
    }
  }

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
  const errors = []

  if (!discordWebhookUrl) {
    return {
      sent: 0,
      errors,
    }
  }

  let sent = 0

  for (const post of posts) {
    try {
      if (discordWebhookUrl) {
        await sendDiscordNotification(discordWebhookUrl, post)
      }

      sent += 1
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  return {
    sent,
    errors,
  }
}
