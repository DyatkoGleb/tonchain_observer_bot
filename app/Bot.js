const TelegramBot = require('node-telegram-bot-api')


module.exports = class Bot {
    constructor({ tgBotToken }) {
        this.bot = new TelegramBot(tgBotToken, { polling: true })
    }

    sendMessage = (text) => {
        this.bot.sendMessage(process.env.TG_CHAT_ID, text, { parse_mode: 'MarkdownV2' })
    }
}