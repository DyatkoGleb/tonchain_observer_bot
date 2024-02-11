const { HttpClient, Api } = require('tonapi-sdk-js')


module.exports = class TonBlockchainService {
    DIVISOR_TO_NORMAL = 1_000_000_000
    COST_CEILING = 11
    MIN_PRICES = 0
    OFFSET = 1000

    constructor({ walletAddress, tonApiToken }) {
        this.walletAddress = walletAddress
        this.tonApiToken = tonApiToken

        this.#makeClient()
    }

    #makeClient = () => {
        const httpClient = new HttpClient({
            baseUrl: 'https://tonapi.io/',
            baseApiParams: {
                headers: {
                    Authorization: `Bearer ${this.tonApiToken}`,
                    'Content-type': 'application/json'
                }
            }
        })

        this.client = new Api(httpClient)
    }

    getCollection = async () => {
        const nfts = []
        let collection = []

        const collectionResponse = await this.client.nft.getNftCollection(this.walletAddress)
        let collectionNftQuantities = collectionResponse.next_item_index


        for (let i = 0; i < collectionNftQuantities; i += this.OFFSET) {
            const response = await this.client.nft.getItemsFromCollection( this.walletAddress,{ offset: i })

            collection = response.nft_items

            for (let nft of collection) {
                if (
                    nft.sale
                    && nft.sale.price.value / this.DIVISOR_TO_NORMAL < this.COST_CEILING
                    && nft.sale.price.value > this.MIN_PRICES
                ) {
                    nfts.push({
                        name: nft.metadata.name,
                        num: nft.index - 1,
                        price: nft.sale.price.value / this.DIVISOR_TO_NORMAL,
                        currency: nft.sale.price.token_name,
                        link: nft.metadata.external_url,
                        image: nft.previews[2].url,
                        attributes: nft.metadata.attributes,
                    })
                }
            }
        }

        return nfts
    }
}