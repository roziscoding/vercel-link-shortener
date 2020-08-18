import { NowRequest, NowResponse } from '@vercel/node'
import { getLongUrl } from './services/linkService'

const getRedirectUrl = async (shortcode: string | string[]) => {
  const notFoundUrl = process.env.NOTFOUND_URL || 'https://google.com'

  if (typeof shortcode !== 'string') return notFoundUrl

  return (await getLongUrl(shortcode)) || notFoundUrl
}

const redirect = async (req: NowRequest, res: NowResponse) => {
  const shortcode = req.query.shortcode

  const redirectUrl = await getRedirectUrl(shortcode)
  res.setHeader('Location', redirectUrl)
  return res.status(307).end()
}

export default redirect
