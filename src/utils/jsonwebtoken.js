import jwt from "jsonwebtoken";

const private_key = "palabrasecretaparatoken";

const generateToken = (user) => {
    return jwt.sign(user, private_key, { expiresIn: "24h" });
}

export default generateToken;
