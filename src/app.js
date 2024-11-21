import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from "./utils.js";
import * as path from "path";
import exphbs from 'express-handlebars';


import cookieRouter from "./routes/cookiesRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import loginRouter from "./routes/loginRouter.js";
import userRouter from './routes/userRouter.js';
import userModel from "./models/userModel.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";





const app = express();

const mongoAtlasUri = `mongodb+srv://joseoliveira:joseoliveira123@joseoliveira.75t2f.mongodb.net/?retryWrites=true&w=majority&appName=JoseOliveira`

mongoose.connect(mongoAtlasUri);

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true })); // Formatea query params de URLs para peticiones entrantes.
app.use(express.static("public")); // Sirve archivos estáticos desde la carpeta public.
app.use(cookieParser())

app.use(session({
  secret: 'codigoSecreto',
  resave: true, // permite mantener la sesion activa en caso de que haya inactividad en el uso del cliente.
  saveUninitialized: true, //permite guardar cualquier sesion aún cuando el objeto de sesion no contenga nada.
  store: MongoStore.create({
    mongoUrl: mongoAtlasUri,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 15 // tiempo de vida de la sesion en segundos.
  })
}));

initializePassport();  // colocar el passport siempre debajo de session porque van juntos.
app.use(passport.initialize());
app.use(passport.session());



app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));





//handlebars
app.get('/', async (req, res) => {

  const { userId } = req.session
  const user = await userModel.findOne({ _id: userId }).lean()

  res.render('home', {
    title: 'Bienvenidx',
    user
  })
})


//registrarse
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Registrarse'
  })
})


// iniciar sesion
app.get('/login', async (req, res) => {

  const error = req.session.error
  delete req.session.error // para limpiar el error de la pantalla 

  res.render('login', {
    error,
    notifications: {
      message: req.session.message
    }
  })
})

//cerrar sesion
app.get('/logout', async (req, res) => {
  req.session.destroy;
  res.redirect('/login')
})

//recuperar contraseña
app.get('/recovery-password', async (req, res) => {
  res.render('recovery-password', {
    title: 'Recuperar Contraseña'
  })
})



//current
// app.get('/api/login/current', async (req, res) => {

//   const dataUser = req.dataUser

//   res.render('current', {
//     dataUser,
//     message: 'datos no sensibles'
//   })

// })


app.use("/api/cookies", cookieRouter);
app.use("/api/session", sessionRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);





const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});

// s%3A4Z3hDDE3QjthY_fSW1m0yefwuTxczelI.LNsjEuLA%2Bl7UIL%2Fsu3pUmltwhQaC2zbaCV%2FUh%2FtHzFM
