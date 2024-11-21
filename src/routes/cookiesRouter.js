import { Router } from "express";

const router = Router()


router.get('/', async (req, res) => {
    res.render('cookies', {
        title: 'Cookies'
    })
})

router.get('/getCookies', async (req, res) => {
    try {
        console.log(req.cookies)
        res.send({ status: 'succes', data: req.cookies })
    } catch (error) {
        res.status(400).send('error')
    }
})

router.post('/setCookies', async (req, res) => {
    const { name, email } = req.body
    try {
        res.cookie('name', name);
        res.cookie('email', email);
        res.send({ status: 'success', message: 'Cookies set' })
    } catch (error) {
        res.status(400).send({ message: 'error de cookies' })
    }
})





export default router;