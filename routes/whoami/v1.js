module.exports = (req, res, next) => {
    res.send(req.user)
    return next()
}
