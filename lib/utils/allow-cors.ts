import { ApiHandlerWrapper } from '../types/ApiHandlerWrapper'

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

  return fn(req, res)
}
