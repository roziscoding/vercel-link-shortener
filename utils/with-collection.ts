import { Collection, MongoClient } from 'mongodb'

export const withCollection = <TCollection = any>(collectionName: string) => async <TResult>(
  fn: (collection: Collection<TCollection>) => TResult
): Promise<TResult> => {
  const dbUri = process.env.DB_URI

  if (!dbUri) throw new Error('No database URI provided')

  const connection = await MongoClient.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const collection = await connection.db(process.env.DB_NAME).collection(collectionName)

  const result = await fn(collection)

  connection.close()

  return result
}
