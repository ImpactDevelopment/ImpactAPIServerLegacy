const MODULE_ID = 'app:main'
global.rfr = require('rfr') // Global for all modules (don't do this at home kids)
const config    = rfr('/config')
const logger    = rfr('/utils/logger')

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
rfr('routes')(server)

// Serve
server.listen(config.PORT)
logger.info('%s: ready. listening on PORT ', MODULE_ID, config.PORT)

module.exports = server

