import { NowApiHandler } from '@vercel/node'

type ApiHandlerWrapper = (fn: NowApiHandler) => NowApiHandler

export const allowCors: ApiHandlerWrapper = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || '*'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  return await fn(req, res)
}
