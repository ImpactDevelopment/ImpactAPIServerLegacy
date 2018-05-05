const MODULE_ID = 'api:register'
const validateEmail = require('email-validator').validate
const logger    = rfr('utils/logger')
const errors    = require('restify-errors')
const User  = rfr('service/user')

const passwordRegex = RegExp('[a-zA-Z0-9_!@#$%^&*()+{}|:">?=\\;\'./]{1,64}')

module.exports = async (req, res, next) => {
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

    try {
        if (await User.findOne({ 'email': req.body.email }) !== null) {
            return next(new errors.BadRequestError('User with email "' + req.body.email + '" already exists.'))
        }

        const user = new User({
            'email': req.body.email,
            'password': req.body.password
        })
        try {
            await user.save()
            // Send a response with a signed access token if the operation was a success
            res.send({
                'token': user.genToken()
            })

            logger.info('%s: response sent', MODULE_ID)
            return next()
        } catch(err) {
            logger.error('Error adding user ' + req.body.email, err)
            return next(new errors.InternalServerError('Error adding user to the database'))
        }
    } catch(err) {
        logger.error('Error looking for user with email ' + req.body.email, err)
        return next(new errors.InternalServerError('Error checking for existing user'))
    }
}
