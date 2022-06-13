import { endWithText } from 'vercel-telegram-bot-api/lib/reply'
import { CommandHandler } from '../types/CommandHandler'
import { linkExists, setLinkPublic } from '../services/linkService'
import { ParseMode } from 'vercel-telegram-bot-api/lib/types/ParseMode'

export const setpublic: CommandHandler = async (params, context) => {
  const [shortcode, isPublic] = params

  if (!shortcode || !isPublic) {
    const text = 'Uso correto: /setpublicc <shortcode> <`true` | `false`>'
    return endWithText(text, context, { parseMode: ParseMode.Markdown })
  }

  if (!['true', 'false'].includes(isPublic))
    return endWithText('O segundo parâmetro deve ser `true` ou `false`', context, {
      parseMode: ParseMode.Markdown
    })

  if (!(await linkExists(shortcode)))
    return endWithText('Não existe nenhum link com esse shortcode!', context)

  await setLinkPublic(shortcode, isPublic === 'true')

  return endWithText(
    `Link \`${shortcode}\` definido como ${isPublic === 'true' ? 'público' : 'privado'}.`,
    context,
    {
      linkPreview: false,
      parseMode: 'Markdown' as any,
      reply: true
    }
  )
}
