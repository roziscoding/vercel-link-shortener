import { TelegramContext } from 'vercel-telegram-bot-api/lib/types/TelegramContext'

export type CommandHandler = (params: string[], context: TelegramContext) => any