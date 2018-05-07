import logger from 'utils/logger'

// this will be used to prefix route paths.
// a workaround since restify does not have this yet
const API_ROOT  = '/api'
const DEFAULT_SECRET = 'some-secret'

export const TEST = process.env['TEST'] === 'true' || process.env['TEST'] === '1' || false
export const LOG_LEVEL = process.env['LOG_LEVEL'] || 'info'
export const PORT = process.env['PORT'] || 8080
export const JWT_SECRET = process.env['JWT_SECRET'] || DEFAULT_SECRET
export const JWT_LIFE = process.env['JWT_LIFE'] || 24*60 // token life in minutes
export const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017'

// will be used for building route paths
export const basePath = (path) => API_ROOT.replace(/\/$/, '') + '/' + path.replace(/^\//, '')

if (DEFAULT_SECRET === JWT_SECRET)
    logger.warn('Using the default JWT secret')
