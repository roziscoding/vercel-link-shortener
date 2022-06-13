import { ObjectId } from 'mongodb'
import { IpLocation } from './IpLocation'

export type ShortenedLinkStats = {
  _id: ObjectId
  shortcode: string
  ip: string | null
  location: IpLocation | null
  longUrl: string
  date: Date
  ref: string | null
}
