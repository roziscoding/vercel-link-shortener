import axios from 'axios'
import { getLongUrl } from '../lib/services/linkService'
import { addStats } from '../lib/services/statService'
import { IpLocation } from '../lib/types/IpLocation'
import { allowCors } from '../lib/utils/allow-cors'
import { extract } from '../lib/utils/extract'

const getRedirectUrl = async (shortcode: string | string[]) => {
  const notFoundUrl = process.env.NOTFOUND_URL || 'https://google.com'

  if (typeof shortcode !== 'string') return notFoundUrl

  return (await getLongUrl(shortcode)) || notFoundUrl
}

const treatHeader = (header: string | string[] | undefined) => {
  if (!header) return header
  if (Array.isArray(header)) return header[0]
  return header
}

const getIpLocation = async (ip: string): Promise<IpLocation | null> => {
  const { data: location } = await axios.get<IpLocation>(`http://ip-api.com/json/${ip}`)

  return location.status === 'success' ? location : null
}

const redirect = allowCors(async (req, res) => {
  const shortcode = req.query.shortcode
  const ref = extract('ref').from(req)

  // Does the actual redirect
  const redirectUrl = await getRedirectUrl(shortcode)
  res.setHeader('Location', redirectUrl)
  res.status(307).end()

  // Collects stats
  const originIp = treatHeader(req.headers['x-forwarded-for'])?.split(',')[0] || null
  const location = originIp ? await getIpLocation(originIp) : null

  await addStats(`${shortcode}`, {
    ip: originIp,
    location,
    longUrl: redirectUrl,
    ref
  })
})

export default redirect
