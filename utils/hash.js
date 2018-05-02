const { paramsSync, kdf, verifyKdf } = require('scrypt')
const { SCRYPT_N, SCRYPT_TIME } = rfr('config')
const logger = require('./logger')

paramsSync(Number.parseFloat(SCRYPT_TIME))

module.exports = {
    'hash': async (password) => {
        try {
            const params = {
                'N': Number.parseInt(SCRYPT_N), //Default 2^14, reccomended 2^20
                'r': 8,
                'p':1
            }

            logger.info('params', params)

            const result = await kdf(password, params)

            return result.toString('base64')
        } catch (err) {
            logger.error('Error runnign Scrypt.kdf(): ', err.message)
        }
    },
    // .then will be passed true or false
    'verify': (hash, password) => {
        verifyKdf(hash, password)
        .catch((err) => {
            logger.err('Error verifying hashing password', err)
        })
    }
}

