/* eslint-disable camelcase */
import crypto from 'crypto'
import jwt, { SignOptions } from 'jsonwebtoken'

import { NowApiHandler } from '@vercel/node'

const { TELEGRAM_TOKEN } = process.env

export type TelegramAuthData = {
  id: string
  first_name: string
  username: string
  photo_url: string
  auth_date: string
  hash: string
}

function createCheckString(data: TelegramAuthData) {
  return Object.entries(data)
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => {
      if (a < b) {
        return -1
      }

      if (a > b) {
        return 1
      }

      return 0
    })
    .reduce((result, [key, value]) => {
      return result ? `${result}\n${key}=${value}` : `${key}=${value}`
    }, '')
}

function isHashValid(hash: string, checkString: string) {
  if (!TELEGRAM_TOKEN) return false

  const calculatedHash = crypto
    .createHmac('sha256', TELEGRAM_TOKEN)
    .update(checkString)
    .digest('hex')

  return calculatedHash === hash
}

const requestHandler: NowApiHandler = (req, res) => {
  if (!TELEGRAM_TOKEN) return res.status(500).json({ message: 'No TELGRAM_TOKEN variable' })

  const authData: TelegramAuthData = req.query as TelegramAuthData

  const authDate = parseInt(authData.auth_date, 10)
  const now = Date.now() / 1000
  const authAge = now - authDate

  if (authAge > 10) {
    return res.status(401).json({
      error: {
        code: 'expired_authentication',
        message: `received authentication is ${authAge} seconds old. Must not be older than 30 seconds.`
      }
    })
  }

  const checkString = createCheckString(authData)

  if (!isHashValid(authData.hash, checkString)) {
    return res.status(401).json({
      error: { code: 'invalid_hash', message: 'received hash does not match calculated hash' }
    })
  }

  const jwtOptions: SignOptions = {
    algorithm: 'HS256',
    audience: 'vercel-link-shortener',
    expiresIn: '1h',
    issuer: 'vercel-link-shortener',
    subject: authData.id
  }

  const token = jwt.sign(authData, TELEGRAM_TOKEN, jwtOptions)

  res.status(200).json({ token })
}

export default requestHandler
