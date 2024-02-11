module.exports = class MessageUtils {
    escapeMarkdown = text => String(text).replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&")
}