module.exports = (server) => {
    // unprotected routes
    require('./ping')(server)
    require('./register')(server)
    require('./login')(server)

    // protected routes
    require('./whoami')(server)
}
