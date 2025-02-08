const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const keyEncoding = 'utf8';
const outputEncoding = 'base64';
const inputEncoding = 'utf8';
const decrypt = (strToDecrypt, secretKey) => {
    try {
        const key = Buffer.from(secretKey.padEnd(32, '0').slice(0, 32), keyEncoding);
        const encryptedData = Buffer.from(strToDecrypt, outputEncoding);
        const iv = Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedData, outputEncoding, inputEncoding);
        decrypted += decipher.final(inputEncoding);
        return decrypted;
    } catch (error) {
        throw new Error('Error while decrypting: ' + error.message);
    }
};
module.exports = decrypt;





