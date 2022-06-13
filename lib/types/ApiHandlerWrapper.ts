import { VercelApiHandler } from '@vercel/node'

export type ApiHandlerWrapper = (fn: VercelApiHandler) => VercelApiHandler
