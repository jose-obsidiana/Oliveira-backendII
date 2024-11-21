import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;

//hash password
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // crea un código único para la password
}
export const isValidPassword = (password, passwordHashed) => {
    return bcrypt.compareSync(password, passwordHashed); // compara la password de mongo con la de bcrypt.
}


