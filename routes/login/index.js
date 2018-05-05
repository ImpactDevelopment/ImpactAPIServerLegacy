const config    = rfr('config')

module.exports = (server) => {
    server.post({ 'path': config.basePath('/login'),
        'version': '1.0.0' }, require('./v1'))
}
