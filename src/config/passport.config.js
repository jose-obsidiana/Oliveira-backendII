import passport from 'passport';
import local from 'passport-local';
import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt'
import { PRIVATE_key } from './jsonwebtoken.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;  //permite desencriptar el token


const initializePassport = () => {
    // passport local
    passport.use('register', new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true,
    }, async (req, _email, _password, done) => {
        try {
            const { name, age, email, password } = req.body
            const user = await userModel.findOne({ email });
            if (user) {
                return done(null, false, { message: 'El usuario que intentas crear ya existe.' })
            }

            const newUser = new userModel({
                name,
                age,
                email,
                password: createHash(password)
            });
            const result = await userModel.create(newUser);

            return done(null, result)

        } catch (error) {
            done(error)
        }
    }
    ));

    //passport github
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23li1i3dnDapK60uHk',
        clientSecret: '56b8b5c31635bf3fd13f647145afd95726a99907',
        callbackURL: "http://localhost:8080/api/login/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            console.log('Usuario encontrado', profile)


            const email = profile.emails?.[0]?.value || profile._json.email;
            if (!email) {
                return done(null, false, { message: 'No pudimos obtener el email desde GitHub.' });
            }
            if (!user) {
                const newUser = new userModel({
                    name: profile._json.name,
                    age: '18',
                    email,
                    password: '1234'
                })

                let result = await userModel.create(newUser)
                console.log('Usuario creado exitosamente')

                return done(null, result)
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))



    // passport web token
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['authToken']
            return token;
        }
    }

    passport.use('jwt', new JWTStrategy({

        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_key

    }, async (tokenDesencriptado, done) => {
        try {
            return done(null, tokenDesencriptado)
        } catch (error) {
            return done(null)
        }
    }))



    //serialize
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findOne({ _id: id })
            done(null, user);
        } catch (error) {
            done(error)
        };
    })
};


export default initializePassport;