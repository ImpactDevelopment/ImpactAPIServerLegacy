const MODULE_ID = 'api:login'
const validateEmail = require('email-validator').validate
const logger    = rfr('utils/logger')
const errors    = require('restify-errors')
const User  = rfr('service/user')

const passwordRegex = RegExp('[a-zA-Z0-9_!@#$%^&*()+{}|:">?=\\;\'./]{1,64}')

module.exports = async (req, res, next) => {
    logger.info('%s: request received', MODULE_ID)

    if (!req.body.email || !req.body.password) {
        return next(new errors.BadRequestError('Incomplete login information.'))
    }
    if (!validateEmail(req.body.email)) {
        return next(new errors.BadRequestError('Invalid email.'))
    }
    if(!passwordRegex.test(req.body.password)) {
        return next(new errors.BadRequestError('Password contains invalid chars or is an incorrect length.'))
    }

    try {
        console.log(req.body)
        const user = await User.findOne({ 'email': req.body.email }).select('+password')

        // Check user exists
        if (!user) {
            return next(new errors.InvalidCredentialsError('User with email "' + req.body.email + '" not found.'))
        }

        try {
            // Check password matches
            if (!(await user.comparePassword(req.body.password))) {
                return next(new errors.InvalidCredentialsError('Password incorrect.'))
            }

            // Return a new token
            res.send({
                'token': await user.genToken()
            })
        } catch(e) {
            console.log(e)
            return next(new errors.InternalServerError('Error comparing password or generating token'))
        }
    } catch(err) {
        logger.error('Error looking for user with email ' + req.body.email, err)
        return next(new errors.InternalServerError('Error checking for existing user'))
    }
}
