import { endWithText } from 'vercel-telegram-bot-api/lib/reply'
import { TelegramContext } from 'vercel-telegram-bot-api/lib/types/TelegramContext'

export const assertAdmin = (context: TelegramContext) => {
  const adminId = parseInt(process.env.ADMIN_ID || '0', 10)

  if (!adminId) return Promise.resolve(context)

  if (context.update?.message?.from?.id !== adminId) {
    endWithText('Boa tentativa, mas eu nem te conheço...', context)
    return Promise.reject(new Error('not an admin'))
  }

  return Promise.resolve(context)
}