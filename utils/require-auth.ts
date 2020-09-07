import jwt, {
  VerifyOptions,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError
} from 'jsonwebtoken'

import { ApiHandlerWrapper } from '../types/ApiHandlerWrapper'

const { TELEGRAM_TOKEN } = process.env

export const requireAuth: ApiHandlerWrapper = fn => (req, res) => {
  if (!TELEGRAM_TOKEN) {
    return res.status(500).json({ messasge: 'No TELEGRAM_TOKEN' })
  }

  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ error: { code: 'missing_auth_token', message: 'No auth token provided' } })
  }

  const adminId = process.env.ADMIN_ID

  const [, token] = req.headers.authorization.split(' ')

  if (!token) {
    return res.status(401).json({
      error: {
        code: 'invalid_token_format',
        message: 'Invalid token format. Authorization header must contain a Bearer token'
      }
    })
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
    audience: 'vercel-link-shortener',
    issuer: 'vercel-link-shortener',
    subject: adminId
  }

  try {
    jwt.verify(token, TELEGRAM_TOKEN, verifyOptions)

    return fn(req, res)
  } catch (err) {
    const errorClasses = [JsonWebTokenError, NotBeforeError, TokenExpiredError]

    for (const errorClass of errorClasses) {
      if (err instanceof errorClass) {
        return res.status(401).json({ error: { code: 'invalid_token', message: err.message } })
      }
    }

    return res.status(500).json({ message: err.message })
  }
}
