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

export const setLinkPublic = async (shortcode: string, isPublic: boolean) =>
  withLinks(links => links.updateOne({ shortcode }, { $set: { isPublic } }).then(() => true))

export const createLink = async (shortcode: string, url: string, isPublic = false) =>
  withLinks(async links => {
    const id = new ObjectId()

    const link: ShortenedLink = {
      _id: id,
      longUrl: url,
      shortcode,
      isPublic
    }

    await links.insertOne(link)

    return link
  })
