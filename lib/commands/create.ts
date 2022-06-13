import { endWithText } from 'vercel-telegram-bot-api/lib/reply'

import { shortUrlPrefix } from '../utils/short-url-prefix'
import { CommandHandler } from '../types/CommandHandler'
import { linkExists, createLink } from '../services/linkService'
import { ParseMode } from 'vercel-telegram-bot-api/lib/types/ParseMode'

export const create: CommandHandler = async (params, context) => {
  const [shortcode, longUrl, isPublic] = params

  if (!shortcode || !longUrl) {
    const text = 'Uso correto: /create <shortcode> <url completa> [link público? `true` | `false`]'
    return endWithText(text, context, { parseMode: ParseMode.Markdown })
  }

  if (await linkExists(shortcode))
    return endWithText('Um link com esse shortcode já existe!', context)

  const newLink = await createLink(shortcode, longUrl, isPublic === 'true')

  const replyText = [
    `Link \`${newLink._id.toHexString()}\` criado.`,
    `${shortUrlPrefix}/${newLink.shortcode} -> ${newLink.longUrl}`
  ].join('\n')

  return endWithText(replyText, context, {
    linkPreview: false,
    parseMode: 'Markdown' as any,
    reply: true
  })
}
