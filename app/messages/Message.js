const Utils = require('./MessageUtils')


module.exports = class MessageEntity
{
    constructor () {
        this.utils = new Utils()
        this.text = ''
    }

    addTextWithLink = (text, link) => {
        this.text += `[${this.utils.escapeMarkdown(text)}](${link})`
    }

    addText = (text) => {
        this.text += this.utils.escapeMarkdown(text)
    }

    addVerticalSpase = (num = 1) => {
        for (let i = 0; i < num; i++) {
            this.text += '\n'
        }
    }

    getText = () => {
        return this.text
    }
}