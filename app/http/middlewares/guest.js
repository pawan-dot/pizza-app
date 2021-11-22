function guest (req, res, next) {
    if(!req.isAuthenticated()) {//passport function
        return next()
    }
    return res.redirect('/')
}

module.exports = guest