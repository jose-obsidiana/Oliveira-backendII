import { Router } from 'express'
import userModel from '../models/userModel.js';
import { isValidPassword } from '../utils.js';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { createHash } from '../utils.js'
import { generateToken, authTokenMiddleware } from '../config/jsonwebtoken.js'



const router = Router()

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).lean();

        if (!user) {
            req.session.error = 'Email o Contraseña inválida, inténtelo de nuevo.'
            return res.redirect('/login')
        }

        // comparo la password que viene del formulario con la que está guardada en mongo
        if (!isValidPassword(password, user.password)) {
            req.session.error = 'Credenciales inválidas 2'
            return res.redirect('/login')
        }
        else {
            const token = generateToken({ id: user._id, email: user.email, name: user.name })
            res.cookie('authToken', token, { httpOnly: true, secure: true });

            // res.send({ status: 'success', token })
            return res.redirect('/api/login/current')
        }


        // req.session.userId = user._id
        // req.session.error = null;
        // res.redirect('/')

    } catch (error) {
        console.log(error, 'error en servidor');
        req.session.error = 'Error en el servidor'
        res.redirect('/login')
    }
})




//REGISTRARSE CON PASSPORT DE TERCEROS (GITHUB)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })


router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;

    if (req.user) {
        res.redirect('/');
    }
    res.redirect('/login')

})


// REGISTRARSE CON TOKEN
router.post('/register', async (req, res) => {
    const { name, email, age, password } = req.body

    if (!email || !password) {
        res.status(400).send({ error: 'error', message: 'email y password son obligatorios' })
    }

    const user = await userModel.findOne({ email })

    if (user) {
        return res.status(400).send({ error: 'error', message: 'Ya existe un usuario con esas credenciales' })
    }

    const newUser = new userModel({
        name,
        age,
        email,
        password: createHash(password)
    })

    const result = await userModel.create(newUser)
    res.redirect('/')
})

// current para ver datos sensibles ||  authTokenMiddleware
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {

    const dataUser = req.user

    res.render('current', {
        dataUser,
        message: 'datos sensibles'
    });

})

export default router;
