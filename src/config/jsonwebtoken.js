import jsonwebtoken from 'jsonwebtoken';

export const PRIVATE_key = 'CoderCl@v3Private'

export const generateToken = user => jsonwebtoken.sign(user, PRIVATE_key, { expiresIn: '1d' })

export const authTokenMiddleware = (req, res, next) => {
    const token = req.cookies.authToken; // Obtiene el token de las cookies

    if (!token) {
        return res.status(401).send({ message: 'No autorizado, token faltante' });
    }

    // Verificar el token
    jsonwebtoken.verify(token, PRIVATE_key, (error, decoded) => {
        if (error) {
            return res.status(403).send({ message: 'Token inválido' });
        }

        req.user = decoded; // Guardar los datos del usuario decodificados
        next();
    });
};

// export default { generateToken, authTokenMiddleware, PRIVATE_key };