import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
            const userExists = await UserModel.findOne({ email: username });
            if (userExists) return done(null, false, { message: "Email ya está en uso." });

            const newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            };

            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return done(null, false, { message: "Usuario no encontrado." });
            if (!isValidPassword(password, user)) return done(null, false, { message: "Contraseña incorrecta." });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia JWT
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
        secretOrKey: "palabrasecretaparatoken"
    }, async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.id);
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;
