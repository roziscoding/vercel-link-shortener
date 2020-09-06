import { NowApiHandler } from '@vercel/node'
import { createLink, getAllLinks, removeLink } from '../services/linkService'

const getHandler: NowApiHandler = async (req, res) => {
  const links = await getAllLinks()

  res.status(200).json(links)
}

const postHandler: NowApiHandler = async (req, res) => {
  const { shortcode, url } = req.body

  if (!shortcode || !url) {
    return res.status(422).json({ message: 'Missing shortcode or url' })
  }

  const link = await createLink(shortcode, url)

  res.status(201).json(link)
}

const deleteHandler: NowApiHandler = async (req, res) => {
  const { shortcode } = req.query

  if (!shortcode || Array.isArray(shortcode)) return res.status(404).end()

  await removeLink(shortcode)

  res.status(204).end()
}

const defaultHandler: NowApiHandler = (req, res) => {
  res.status(404).send(`CANNOT ${req.method} /api/links`)
}

const requestHandler: NowApiHandler = (req, res) => {
  const methodHandlers: Record<string, NowApiHandler> = {
    GET: getHandler,
    POST: postHandler,
    DELETE: deleteHandler,
    DEFAULT: defaultHandler
  }

  const methodHandler = methodHandlers[req.method || 'DEFAULT'] || defaultHandler

  return methodHandler(req, res)
}

export default requestHandler
