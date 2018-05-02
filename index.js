const MODULE_ID = 'app:main'
const config    = require('./config')
const logger    = require('./utils/logger')

const jwt     = require('restify-jwt-community')
const restify = require('restify')
const plugins = require('restify').plugins

logger.info('%s: initializing', MODULE_ID)

const server  = restify.createServer()
server.use(plugins.bodyParser())

// Auth
server.use(jwt({
    // Config
    'secret': config.JWT_SECRET
}).unless({
    // Unauthenticated paths
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

