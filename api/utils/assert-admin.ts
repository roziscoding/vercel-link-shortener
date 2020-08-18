import { endWithText } from 'vercel-telegram-bot-api/lib/reply'
import { TelegramContext } from 'vercel-telegram-bot-api/lib/types/TelegramContext'

export const assertAdmin = (context: TelegramContext) => {
  const adminId = parseInt(process.env.ADMIN_ID || '0', 10)

  if (!adminId) return

  if (context.update?.message?.from?.id !== adminId) {
    endWithText('Boa tentativa, mas eu nem te conheço...', context)
    throw new Error('not an admin')
  }
}