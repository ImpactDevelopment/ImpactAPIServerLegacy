import jwt from 'restify-jwt-community'
import errors from 'restify-errors'
import User from './user'
import { JWT_SECRET, JWT_LIFE, basePath } from '~/config'

function isRevoked (req, payload, done) {
    const life = Math.floor(Date.now() / 1000) - Number.parseInt(payload.iat)
    done(null, !(life >= 0 && life < JWT_LIFE * 60))
}

// Load the matching user object from the database
async function loadUser (req, res, next) {
    if (req.token && req.token.email) {
        try {
            req.user = await User.findOne({ 'email': req.token.email })
            if (!req.user) throw new Error('User matching token not found')
        } catch (e) {
            return next(errors.InvalidCredentialsError)
        }
    }

    return next()
}

export default (server) => {
    server.use(jwt({
        // Config
        'secret': JWT_SECRET,
        'requestProperty': 'token',
        isRevoked
    }).unless({
        // Unauthenticated paths
        'path': [
            basePath('/ping'),
            basePath('/login'),
            basePath('/register')
        ]
    }))
    server.use(loadUser)
}
