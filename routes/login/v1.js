import { validate as validateEmail } from 'email-validator'
import errors from 'restify-errors'
import logger from '~/utils/logger'
import User from '~/service/user'

const passwordRegex = RegExp('[a-zA-Z0-9_!@#$%^&*()+{}|:">?=\\;\'./]{1,64}')

export default async (req, res, next) => {
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
        const user = await User.findOne({ 'email': req.body.email }).select('+password')

        // Check user exists
        if (!user) {
            return next(new errors.InvalidCredentialsError('User with email "' + req.body.email + '" not found.'))
        }

        // Check password matches
        if (!(await user.comparePassword(req.body.password))) {
            return next(new errors.InvalidCredentialsError('Password incorrect.'))
        }

        // Return a new token
        res.send({ 'token': await user.genToken() })
    } catch(err) {
        logger.error('Error looking for user with email ' + req.body.email, err)
        return next(new errors.InternalServerError('Error checking for existing user'))
    }
}
