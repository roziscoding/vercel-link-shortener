import { VercelApiHandler } from '@vercel/node'

import { allowCors } from '../lib/utils/allow-cors'
import {
  createLink,
  getAllLinks,
  linkExists,
  removeLink,
  setLinkPublic
} from '../lib/services/linkService'
import { requireAuth } from '../lib/utils/require-auth'

const getHandler: VercelApiHandler = async (_req, res) => {
  const links = await getAllLinks()

  res.status(200).json(links)
}

const postHandler: VercelApiHandler = async (req, res) => {
  const { shortcode, url, isPublic } = req.body

  if (!shortcode || !url) {
    return res.status(422).json({ message: 'Missing shortcode or url' })
  }

  const link = await createLink(shortcode, url, isPublic)

  return res.status(201).json(link)
}

const patchHandler: VercelApiHandler = async (req, res) => {
  const { shortcode } = req.query
  const { isPublic } = req.body

  if (!shortcode || Array.isArray(shortcode)) return res.status(404).end()

  if (!(await linkExists(shortcode))) return res.status(404).end()

  await setLinkPublic(shortcode, isPublic)

  res.status(204).end()
}

const deleteHandler: VercelApiHandler = async (req, res) => {
  const { shortcode } = req.query

  if (!shortcode || Array.isArray(shortcode)) return res.status(404).end()

  await removeLink(shortcode)

  return res.status(204).end()
}

const defaultHandler: VercelApiHandler = (req, res) => {
  res.status(404).send(`CANNOT ${req.method} /api/links`)
}

const requestHandler = allowCors(
  requireAuth((req, res) => {
    const methodHandlers: Record<string, VercelApiHandler> = {
      GET: getHandler,
      POST: postHandler,
      DELETE: deleteHandler,
      PATCH: patchHandler,
      DEFAULT: defaultHandler
    }

    const methodHandler = methodHandlers[req.method || 'DEFAULT'] || defaultHandler

    return methodHandler(req, res)
  })
)

export default requestHandler
