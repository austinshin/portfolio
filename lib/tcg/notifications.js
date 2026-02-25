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
  const payload = {
    chat_id: chatId,
    text: createMessage(post),
    disable_web_page_preview: false,
  }

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

export const notifyNewPosts = async (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return {
      sent: 0,
      errors: [],
    }
  }

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  const errors = []

  if (!discordWebhookUrl && (!telegramBotToken || !telegramChatId)) {
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

      if (telegramBotToken && telegramChatId) {
        await sendTelegramNotification(telegramBotToken, telegramChatId, post)
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
