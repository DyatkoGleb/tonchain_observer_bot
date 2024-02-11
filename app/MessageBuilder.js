const Message = require('./messages/Message')


module.exports = class MessageBuilder {
    makeTextMessage = (nft) => {
        const message = new Message()

        if (nft.link) {
            message.addTextWithLink(nft.name, nft.link)
        } else {
            message.addText(nft.name)
        }

        message.addVerticalSpase(2)
        message.addText('Price: ' + nft.price + ' ' + nft.currency)
        message.addVerticalSpase(2)

        for (let i = 0; i < nft.attributes.length; i++) {
            if (!nft.attributes[i].value) {
                continue
            }

            if (!i) {
                message.addTextWithLink('◾️', nft.image)
                message.addTextWithLink( nft.attributes[i].trait_type + ': ' + nft.attributes[i].value)
                message.addVerticalSpase()
                continue
            }

            message.addText('◾️' + nft.attributes[i].trait_type + ': ' + nft.attributes[i].value)
            message.addVerticalSpase()
        }

        message.addVerticalSpase()

        return message.getText()
    }
}