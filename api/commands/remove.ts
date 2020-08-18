import { endWithText } from 'vercel-telegram-bot-api/lib/reply'

import { removeLink } from '../services/linkService'
import { CommandHandler } from '../types/CommandHandler'

export const remove: CommandHandler = async ([ shortcode ], context) => {
  if (!shortcode) return endWithText('Uso correto: /remove <shortcode>', context)

  await removeLink(shortcode)

  return endWithText(`Link \`${shortcode}\` excluído com sucesso!`, context, {
    parseMode: 'Markdown' as any,
    reply: true
  })
}
