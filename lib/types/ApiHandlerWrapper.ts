import { NowApiHandler } from '@vercel/node'

export type ApiHandlerWrapper = (fn: NowApiHandler) => NowApiHandler
