function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next()
    }
    res.redirect('/login')
}

function isNotAuthenticated(req, res, next) {
    if (!req.session.userId) {
        return next()
    }
    res.redirect('/')
}

export { isAuthenticated, isNotAuthenticated };

