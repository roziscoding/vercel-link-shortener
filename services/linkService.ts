import { ShortenedLink } from '../types/ShortenedLink'
import { Collection, MongoClient, ObjectId } from 'mongodb'

const withCollection = async <TReturn> (
  fn: (collection: Collection) => TReturn
): Promise<TReturn> => {
  const dbUri = process.env.DB_URI

  if (!dbUri) throw new Error('No database URI provided')

  const connection = await MongoClient.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const collection = await connection.db(process.env.DB_NAME).collection('links')

  const result = await fn(collection)

  connection.close()

  return result
}

export const getLongUrl = async (shortcode: string) =>
  withCollection(collection =>
    collection
      .findOne<ShortenedLink>({ shortcode })
      .then(async result => {
        if (!result) return null
        return result.longUrl
      })
  )

export const getAllLinks = async () =>
  withCollection(collection => collection.find<ShortenedLink>().toArray())

export const linkExists = async (shortcode: string) =>
  withCollection(collection => collection.countDocuments({ shortcode }).then(count => count > 0))

export const removeLink = async (shortcode: string) =>
  withCollection(collection => collection.deleteOne({ shortcode }).then(() => true))

export const createLink = async (shortcode: string, url: string) =>
  withCollection(async collection => {
    const id = new ObjectId()

    const link: ShortenedLink = {
      _id: id,
      longUrl: url,
      shortcode
    }

    await collection.insertOne(link)

    return link
  })
