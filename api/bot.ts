import { NowRequest, NowResponse } from '@vercel/node'
import { getUpdateHandler } from 'vercel-telegram-bot-api'
import { endWithText } from 'vercel-telegram-bot-api/lib/reply'
import { getAuthenticatedContext } from 'vercel-telegram-bot-api/lib/context'

import { TelegramContext } from 'vercel-telegram-bot-api/lib/types/TelegramContext'
import { createLink, getAllLinks, linkExists, removeLink } from '../services/linkService'

const assertAdmin = (context: TelegramContext) => {
  const adminId = parseInt(process.env.ADMIN_ID || '0', 10)

  if (!adminId) return

  if (context.update?.message?.from?.id !== adminId) {
    endWithText('Boa tentativa, mas eu nem te conheço...', context)
    throw new Error('not an admin')
  }
}

const handleUpdate = async (req: NowRequest, res: NowResponse) => {
  const token = process.env.TELEGRAM_TOKEN

  if (!token) return res.status(500).end()

  getAuthenticatedContext(token, req, res)
    .then(
      getUpdateHandler({
        commands: {
          new: async (params, context) => {
            assertAdmin(context)

            const [shortcode, longUrl] = params

            if (!shortcode || !longUrl) {
              const text = 'Uso correto: /new <shortcode> <url completa>'
              return endWithText(text, context)
            }

            if (await linkExists(shortcode))
              return endWithText('Um link com esse shortcode já existe!', context)

            const newLink = await createLink(shortcode, longUrl)

            const replyText = `Link \`${newLink._id.toHexString()}\` criado. \`${
              newLink.shortcode
            }\` -> ${newLink.longUrl}`

            return endWithText(replyText, context, {
              linkPreview: false,
              parseMode: 'Markdown' as any,
              reply: true
            })
          },
          links: async (_, context) => {
            assertAdmin(context)

            const links = await getAllLinks()

            if (!links.length) return endWithText('Nenhum link cadastrado', context)

            const text = links.map(link => `\`${link.shortcode}\` -> ${link.longUrl}`).join('\n')

            return endWithText(text, context, {
              linkPreview: false,
              reply: true,
              parseMode: 'Markdown' as any
            })
          },
          remove: async ([shortcode], context) => {
            assertAdmin(context)

            if (!shortcode) return endWithText('Uso correto: /remove <shortcode>', context)

            await removeLink(shortcode)

            return endWithText(`Link \`${shortcode}\` excluído com sucesso!`, context, {
              parseMode: 'Markdown' as any,
              reply: true
            })
          }
        }
      })
    )
    .catch(err => {
      console.error(err.message)
    })
}

export default handleUpdate
