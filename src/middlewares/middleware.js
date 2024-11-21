function auth(req, res, next) {

    if (req.session?.name === 'jose' && req.session?.admin === true) {
        return next();
    }
    return res.status(401).send('Error de autenticación')
}



export default auth;