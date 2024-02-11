const express = require('express')


module.exports = class App {
    PORT = process.env.PORT || 4446
    OBSERVATION_INTERVAL = 60_000

    constructor({ bot, messageBuilder, tonBlockchainService }) {
        this.tonBlockchainService = tonBlockchainService
        this.messageBuilder = messageBuilder
        this.bot = bot

        this.app = express()

        this.#startServer()
        this.#startObserver()
    }

    #startObserver = () => {
        setInterval(async () => {
            for (const nft of await this.tonBlockchainService.getCollection()) {
                this.bot.sendMessage(this.messageBuilder.makeTextMessage(nft))
            }
        }, this.OBSERVATION_INTERVAL)
    }

    #startServer = () => {
        this.app.listen(this.PORT, () => {
            console.log(`Server is running on port ${this.PORT}`)
        })
    }
}