global.rfr = require('rfr') // Global for all modules (don't do this at home kids)
const restify = require('restify')
const mongoose = require('mongoose')
const plugins = require('restify').plugins
const config = rfr('/config')
const logger = rfr('/utils/logger')

mongoose.connect(config.MONGODB_URI)

const server = restify.createServer()

// Auth
rfr('service/auth')(server)

// Throttling
if (!config.TEST) {
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
}

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
logger.info('Server listening on PORT ', config.PORT)

module.exports = server

