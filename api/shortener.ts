import { allowCors } from '../utils/allow-cors'
import { getLongUrl } from '../services/linkService'

const getRedirectUrl = async (shortcode: string | string[]) => {
  const notFoundUrl = process.env.NOTFOUND_URL || 'https://google.com'

  if (typeof shortcode !== 'string') return notFoundUrl

  return (await getLongUrl(shortcode)) || notFoundUrl
}

const redirect = allowCors(async (req, res) => {
  const shortcode = req.query.shortcode

  const redirectUrl = await getRedirectUrl(shortcode)
  res.setHeader('Location', redirectUrl)
  return res.status(307).end()
})

export default redirect
