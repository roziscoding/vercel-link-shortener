import { ObjectId } from 'mongodb'

export type ShortenedLink = {
  _id: ObjectId
  shortcode: string
  longUrl: string
}
