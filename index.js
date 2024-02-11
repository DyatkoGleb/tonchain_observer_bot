require('dotenv').config()
const App = require('./app/App')
const Bot = require('./app/Bot')
const MessageBuilder = require('./app/MessageBuilder')
const TonBlockchainService = require('./app/services/TonBlockchainService')


new App({
    bot: new Bot({ tgBotToken: process.env.TG_BOT_TOKEN }),
    messageBuilder: new MessageBuilder(),
    tonBlockchainService : new TonBlockchainService({
        walletAddress: 'EQD3Ho_9KoqjSmNzfKorctLvTVabn9U_BqnjIPq17SlLs_9H',
        tonApiToken: process.env.TON_API_TOKEN,
    }),
})
