export default (req, res, next) => {
    res.send({ 'ping': 'OK' })
    return next()
}
