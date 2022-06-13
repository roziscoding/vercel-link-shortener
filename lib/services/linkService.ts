import { ObjectId } from 'mongodb'
import { ShortenedLink } from '../types/ShortenedLink'
import { withCollection } from '../utils/with-collection'

const withLinks = withCollection<ShortenedLink>('links')

export const getLongUrl = async (shortcode: string) =>
  withLinks(links =>
    links
      .findOne<ShortenedLink>({ shortcode })
      .then(async result => {
        if (!result) return null
        return result.longUrl
      })
  )

export const getAllLinks = async () => withLinks(links => links.find<ShortenedLink>().toArray())

export const linkExists = async (shortcode: string) =>
  withLinks(links => links.countDocuments({ shortcode }).then(count => count > 0))

export const removeLink = async (shortcode: string) =>
  withLinks(links => links.deleteOne({ shortcode }).then(() => true))

export const createLink = async (shortcode: string, url: string) =>
  withLinks(async links => {
    const id = new ObjectId()

    const link: ShortenedLink = {
      _id: id,
      longUrl: url,
      shortcode
    }

    await links.insertOne(link)

    return link
  })
