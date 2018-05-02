const MODULE_ID = 'api:register'
const jwt = require('jsonwebtoken')
const validateEmail = require('email-validator').validate
const logger    = rfr('utils/logger')
const config    = rfr('config')
const errors    = require('restify-errors')
const database  = rfr('service/database')

const passwordRegex = RegExp('[a-zA-Z0-9_!@#$%^&*()+{}|:">?=\\;\'./]{1,64}')

module.exports = (req, res, next) => {
    logger.info('%s: request received', MODULE_ID)

    if (!req.body.email || !req.body.password) {
        return next(new errors.BadRequestError('Incomplete registration information.'))
    }
    if (!validateEmail(req.body.email)) {
        return next(new errors.BadRequestError('Invalid email.'))
    }
    if(!passwordRegex.test(req.body.password)) {
        return next(new errors.BadRequestError('Password contains invalid chars or is an incorrect length.'))
    }

    database.getUser({ 'email': req.body.email })
    .then((user) => {
        if (user !== null) {
            return next(new errors.BadRequestError('User with email "' + req.body.email + '" already exists.'))
        }

        database.addUser({
            'email': req.body.email,
            'password': req.body.password // TODO: hash
        })
        .then((user) => {
            // Send a response with a signed access token if the operation was a success
            res.send({
                'token' : jwt.sign({
                    'uuid' : user.id,
                    'iat'  : Math.floor(Date.now() / 1000)
                }, config.JWT_SECRET)
            })
            logger.info('%s: response sent', MODULE_ID)
            return next()
        })
        .catch((err) => {
            logger.err('Error adding user ' + req.body.email, err)
            return next(new errors.InternalServerError('Error adding user to the database'))
        })
    })
    .catch((err) => {
        logger.err('Error looking for user with email ' + req.body.email, err)
        return next(new errors.InternalServerError('Error checking for existing user'))
    })
}
