import crypto from 'node:crypto'
import { getTcgPagePassword } from './config.js'
import { TCG_PASSWORD_HEADER } from './constants.js'

const timingSafeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export const getRequestPassword = (req) => {
  const headerValue = req.headers[TCG_PASSWORD_HEADER]

  if (typeof headerValue === 'string') {
    return headerValue.trim()
  }

  if (Array.isArray(headerValue)) {
    return headerValue[0]?.trim() || ''
  }

  if (typeof req.query?.password === 'string') {
    return req.query.password.trim()
  }

  if (req.body && typeof req.body === 'object' && typeof req.body.password === 'string') {
    return req.body.password.trim()
  }

  return ''
}

export const isTcgAuthorized = (req) => {
  const received = getRequestPassword(req)
  const expected = getTcgPagePassword()

  if (!received || !expected) {
    return false
  }

  return timingSafeEqual(received, expected)
}

export const rejectUnauthorized = (res) => {
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Password required for this endpoint.',
  })
}
