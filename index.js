import 'module-alias/register'
import restify from 'restify'
import mongoose from 'mongoose'
import { plugins } from 'restify'
import { MONGODB_URI, TEST, PORT } from '~/config'
import logger from '~/utils/logger'
import auth from '~/service/auth'
import reqdir from '~/utils/reqdir'

mongoose.connect(MONGODB_URI).catch((err) => {
    if (err.message.includes('failed to connect to server')) {
        logger.error('Failed to connect to mongodb server!')
        process.exit() // eslint-disable-line no-process-exit
    }
    throw err
})

const server = restify.createServer()

// Event handlers
server.on('restifyError', function (req, res, err, cb) {
    // Prepend custom members to the error response json
    const json = err.toJSON()
    err.toJSON = () => Object.assign({ 'status': 'failed' }, json)
    return cb()
})

// Auth
auth(server)

// Throttling
if (!TEST) {
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
Object.values(reqdir(module, './routes')).forEach((element) => {
    // Check if this entry has an index or not
    const route = element.hasOwnProperty('index') ? element.index : element

    // If the route is a function, run it
    if (typeof route === 'function') route(server)
})

// Serve
server.listen(PORT)
logger.info('Server listening on PORT ', PORT)

export default server

