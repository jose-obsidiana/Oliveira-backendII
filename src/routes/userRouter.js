import { Router } from 'express';
import userModel from '../models/userModel.js';
import { createHash } from '../utils.js';


const router = Router()


// Consultar todos los usuarios
router.get("/", async (req, res) => {

    try {
        const result = await userModel.find();
        res.send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

router.get('/:uid', async (req, res) => {
    const { uid } = req.params

    try {
        const user = await userModel.findOne({ _id: uid })

        if (user) {
            return res.send({ status: 'succes', payload: user })
        }
        res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });

    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).send({ status: 'error', message: 'Error al buscar usuario' });
    }
})

// Crear un usuario
router.post("/", async (req, res) => {
    const { name, age, email, password } = req.body;
    try {
        const passwordHash = createHash(password)
        const result = await userModel.create({ name, age, email, password: passwordHash });

        req.session.userId = result._id;
        req.session.name = result.name
        res.redirect('/');
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });
    }
});



//recuperar contraseña (crea una nueva contraseña, no recupera la vieja)
router.post('/recovery-password', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            req.session.error = "Email inválido"
            res.redirect('/login')
        }

        const passwordHash = createHash(password)

        await userModel.updateOne({ _id: user._id }, { password: passwordHash });
        req.session.message = 'Contraseña Actualizada';
        res.redirect('/login')
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        req.session.error = 'Error al actualizar la contraseña';
        res.redirect('/login');
    }
})






export default router;