import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import generateToken from "../utils/jsonwebtoken.js";

const router = Router();

// Registro
router.post("/register", (req, res, next) => {
    passport.authenticate("register", { session: false }, (err, user, info) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send(info.message);
        
        const token = generateToken({ id: user._id });
        res.cookie("jwt", token, { httpOnly: true });
        
        // Redirigir al login después de registrarse
        return res.redirect("/login");
    })(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send(info.message);

        const token = generateToken({ id: user._id });
        res.cookie("jwt", token, { httpOnly: true });

        req.session.username = user.first_name;
        
        // Redirigir a home después de iniciar sesión
        return res.redirect("/products");
    })(req, res, next);
});

// Ruta para obtener el usuario actual
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
