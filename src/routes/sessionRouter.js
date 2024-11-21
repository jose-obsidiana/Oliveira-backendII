import { Router } from 'express';
import { authTokenMiddleware } from '../config/jsonwebtoken.js'

const router = Router();


router.get('/', async (req, res) => {
    // si al conectarse la sesion ya existe entonces aumentar el contador
    if (req.session.counter) {
        req.session.counter++
        res.send(`Bienvenidx ${req.session.name}, visitaste el sitio ${req.session.counter} veces.`)
    }
    else {

        const { name } = req.cookies;
        req.session.name = name;
        req.session.counter = 1;
        res.send(`Bienvenidx ${name}`)
    }
})

router.get('/session', (req, res) => {
    const { name } = req.cookies
    if (name !== 'jose') {
        res.send('login failed')
    }
    req.session.name = name;
    req.session.admin = true;
    res.send('Usuario logueado correctamente')
})







export default router;