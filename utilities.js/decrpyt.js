const crypt = require("react-native-crypto-js")


async function decrypt(data) {
    if (
        data == "" || data == undefined){
        return data
    }
    let bytes = crypt.AES.decrypt(data, 'kedarayare');
    let originalText = bytes.toString(crypt.enc.Utf8);
    return originalText
}

module.exports = decrypt;