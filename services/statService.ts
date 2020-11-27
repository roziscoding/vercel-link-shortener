import { ShortenedLinkStats } from '../types/ShortenedLinkStats'
import { withCollection } from '../utils/with-collection'

const withStats = withCollection<ShortenedLinkStats>('stats')
const notFoundUrl = process.env.NOTFOUND_URL || 'https://google.com'

export const addStats = (
  shortcode: string,
  {
    ip = null,
    location = null,
    longUrl = notFoundUrl
  }: Omit<ShortenedLinkStats, '_id' | 'shortcode' | 'date'>
) =>
  withStats(async stats => {
    await stats.insertOne({ shortcode, ip, location, longUrl, date: new Date() })
  })

export default { addStats }
