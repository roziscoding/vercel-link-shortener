import { ShortenedLinkStats } from '../types/ShortenedLinkStats'
import { withCollection } from '../utils/with-collection'

const withStats = withCollection<ShortenedLinkStats>('stats')
const notFoundUrl = process.env.NOTFOUND_URL || 'https://google.com'

export const addStats = (
  shortcode: string,
  {
    ip = null,
    location = null,
    longUrl = notFoundUrl,
    ref
  }: Omit<ShortenedLinkStats, '_id' | 'shortcode' | 'date'>
) =>
  withStats(async stats => {
    await stats.insertOne({ shortcode, ip, location, longUrl, date: new Date(), ref })
  })

export const getStats = (shortcode: string) =>
  withStats(async stats => stats.find({ shortcode }).toArray())

export const getCountryList = (shortcode: string) =>
  withStats(stats =>
    stats
      .aggregate([
        {
          $match: {
            shortcode
          }
        },
        {
          $group: {
            _id: '$location.country',
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ])
      .toArray()
  )

export const getRefList = (shortcode: string) =>
  withStats(stats =>
    stats
      .aggregate([
        {
          $match: {
            shortcode
          }
        },
        {
          $group: {
            _id: '$ref',
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ])
      .toArray()
  )

export const getDailyVisits = (shortcode: string) =>
  withStats(stats =>
    stats
      .aggregate([
        {
          $match: {
            shortcode: shortcode
          }
        },
        {
          $sort: {
            date: 1
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' }
            },
            count: {
              $sum: 1
            }
          }
        }
      ])
      .toArray()
  )

export default { addStats, getStats, getCountryList, getRefList, getDailyVisits }
