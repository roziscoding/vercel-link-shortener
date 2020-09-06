import jwt, {
  SignOptions,
  VerifyOptions,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError
} from 'jsonwebtoken'
import type { NowApiHandler } from '@vercel/node'
import { TelegramAuthData } from '.'

const BEARER_REGEX = /Bearer (?:.+)/
const { TELEGRAM_TOKEN } = process.env

const validatePayload = (payload: any): payload is TelegramAuthData => {
  return payload && typeof payload !== 'string'
}

const requestHandler: NowApiHandler = (req, res) => {
  if (!TELEGRAM_TOKEN) return res.status(500).json({ message: 'No TELGRAM_TOKEN variable' })
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({
      error: { code: 'mising_auth_token', message: 'authorization header is not present' }
    })
  }

  if (!BEARER_REGEX.test(authorization)) {
    return res.status(401).json({
      error: {
        code: 'invalid_auth_header',
        message: 'authorization header must have `Bearer TOKEN` format'
      }
    })
  }

  const [, token] = authorization.split(' ')

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
    audience: 'vercel-link-shortener',
    issuer: 'vercel-link-shortener'
  }

  try {
    const payload = jwt.verify(token, TELEGRAM_TOKEN, verifyOptions)

    if (!validatePayload(payload)) {
      return res
        .status(401)
        .json({ error: { code: 'invalid_token', message: 'cannot read token payload' } })
    }

    const signOptions: SignOptions = {
      algorithm: 'HS256',
      audience: 'vercel-link-shortener',
      expiresIn: '1h',
      issuer: 'vercel-link-shortener',
      subject: payload.id
    }

    const newToken = jwt.sign(payload, TELEGRAM_TOKEN, signOptions)

    res.status(200).json({ token: newToken })
  } catch (err) {
    if (
      err instanceof JsonWebTokenError ||
      err instanceof NotBeforeError ||
      err instanceof TokenExpiredError
    ) {
      return res.status(401).json({ error: { code: 'invalid_token', message: err.message } })
    }

    res.status(500).json({ error: { code: 'internal_error', message: err.message } })
  }
}

export default requestHandler
