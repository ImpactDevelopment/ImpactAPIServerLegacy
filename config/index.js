const logger    = rfr('/utils/logger')

// this will be used to prefix route paths.
// a workaround since restify does not have this yet
const API_ROOT  = '/api'
const DEFAULT_SECRET = 'some-secret'

module.exports = {
    'LOG_LEVEL'   : process.env['LOG_LEVEL'] || 'info',
    'PORT'        : process.env['PORT'] || 8080,
    'JWT_SECRET'  : process.env['JWT_SECRET'] || DEFAULT_SECRET,
    'MONGODB_URI' : process.env['MONGODB_URI'] || 'mongodb://localhost:27017',

    // will be used for building route paths
    'basePath'    : (path) => API_ROOT.replace(/\/$/, '') + '/' + path.replace(/^\//, '')

}

if (DEFAULT_SECRET === module.exports.JWT_SECRET)
    logger.warn('Using the default JWT secret')
