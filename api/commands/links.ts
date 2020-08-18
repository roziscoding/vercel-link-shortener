import { endWithText } from 'vercel-telegram-bot-api/lib/reply'

import { getAllLinks } from '../services/linkService'
import { shortUrlPrefix } from '../utils/short-url-prefix'
import { CommandHandler } from '../types/CommandHandler'

export const links: CommandHandler = async (_, context) => {
  const links = await getAllLinks()

  if (!links.length) return endWithText('Nenhum link cadastrado', context)

  const text = links.map(link => `${shortUrlPrefix}/${link.shortcode} -> ${link.longUrl}`).join('\n')

  return endWithText(text, context, {
    linkPreview: false,
    reply: true,
    parseMode: 'Markdown' as any
  })
}
