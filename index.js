const MODULE_ID = 'app:main'
global.rfr = require('rfr') // Global for all modules (don't do this at home kids)
const config = rfr('/config')
const logger = rfr('/utils/logger')

const restify = require('restify')
const jwt = require('restify-jwt-community')
const mongoose = require('mongoose')
const plugins = require('restify').plugins

logger.info('%s: initializing', MODULE_ID)

mongoose.connect(config.MONGODB_URI)

const server = restify.createServer()

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

// Throttling
server.use(plugins.throttle({
    'ip': true,
    'rate': 1, // Limit each ip to 1 request/second
    'burst': 8, // Maximum 8 concurrent requests
    'overrides': {
        '127.0.0.1' :{
            'rate': 0,
            'burst': 0
        }
    }
}))

// Plugins
server.pre(restify.pre.userAgentConnection()) // Special handling for curl
server.pre(restify.pre.sanitizePath()) // Remove superfluous slashes
server.use(plugins.bodyParser()) // Parse the body of POST requests into a req.body object
server.use(plugins.queryParser()) // Parse the query string into a req.query object
server.use(plugins.dateParser(60 * 3)) // Reject requests whose clocks are 3 mins out
server.use(plugins.gzipResponse()) // Compress response if the request asks us to

// Routes
rfr('routes')(server)

// Serve
server.listen(config.PORT)
logger.info('%s: ready. listening on PORT ', MODULE_ID, config.PORT)

module.exports = server

