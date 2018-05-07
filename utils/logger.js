import { Logger, transports } from 'winston'
import { LOG_LEVEL } from 'config'

const logger = new (Logger)({
    'level': LOG_LEVEL,
    'transports': [
        new (transports.Console)({
            'silent': false,
            'timestamp': false,
            'colorize': true
        })
    ],
    'exitOnError': false
})

logger.debug('util:logger: initialized.')
logger.info('util:logger: ENV LOG_LEVEL =', process.env.LOG_LEVEL || 'info')

export default logger
