const MODULE_ID = 'app:main'
const config    = require('./config')
const logger    = require('./utils/logger')

const jwt       = require('restify-jwt-community')

logger.info('%s: initializing', MODULE_ID)

const restify = require('restify')
const plugins = require('restify').plugins

const server  = restify.createServer()
server.use(plugins.bodyParser())

// Auth
const jwtConfig = {
    'secret': config.JWT_SECRET
}

// secure all routes. except /ping
server.use(jwt(jwtConfig).unless({
    'path': [
        config.basePath('/ping'),
        config.basePath('/register')
    ]
}))

// Routes
require('./routes')(server)

// Serve
server.listen(config.PORT)
logger.info('%s: ready. listening on PORT ', MODULE_ID, config.PORT)

module.exports = server

