const config    = rfr('config')

module.exports = (server) => {
    const PATH = config.basePath('/whoami/')
    server.get({ 'path': PATH,
        'version': '1.0.0' }, require('./v1'))
}
