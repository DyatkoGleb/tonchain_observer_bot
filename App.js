const { HttpClient, Api } = require('tonapi-sdk-js')
const TelegramBot = require('node-telegram-bot-api')
const express = require('express')


module.exports = class App {
    PORT = process.env.PORT || 4446
    TON_NFT_ADDRESS = 'EQD3Ho_9KoqjSmNzfKorctLvTVabn9U_BqnjIPq17SlLs_9H'
    TON_API_TOKEN = process.env.TON_API_TOKEN
    OBSERVATION_INTERVAL = 60_000
    COST_CEILING = 11


    constructor() {
        this.bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true })

        this.app = express()

        this.#startServer()
        this.#makeClient()
        this.#startObserver()
    }

    #startObserver = () => {
        setInterval(async () => {
            this.sendCollection(JSON.stringify(await this.getCollection(), null, 2))
        }, this.OBSERVATION_INTERVAL)
    }

    getCollection = async () => {
        const nfts = []

        for (let i = 0; i < 4; i++) {
            const offset = 1000 * i

            const response = await this.client.nft.getItemsFromCollection(this.TON_NFT_ADDRESS, { offset });
            const collection = response.nft_items

            for (let nft of collection) {
                if (nft.sale && nft.sale.price.value / 1_000_000_000 < this.COST_CEILING && nft.sale.price.value > 0) {
                    const data = {
                        num: nft.metadata.name,
                        price: nft.sale.price.value / 1_000_000_000
                    }

                    nfts.push(data)
                }
            }
        }

        return nfts
    }

    sendCollection = (text) => {
        this.bot.sendMessage(process.env.TG_CHAT_ID, text)
    }

    #makeClient = () => {
        const httpClient = new HttpClient({
            baseUrl: 'https://tonapi.io/',
            baseApiParams: {
                headers: {
                    Authorization: `Bearer ${this.TON_API_TOKEN}`,
                    'Content-type': 'application/json'
                }
            }
        })

        this.client = new Api(httpClient)
    }

    #startServer = () => {
        this.app.listen(this.PORT, () => {
            console.log(`Server is running on port ${this.PORT}`)
        })
    }
}