import jwt from 'jsonwebtoken';
import config from "../../config.mjs";

const authentication = (req, res, next) => {
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "failed", error: "Please login to access this resource" });
    }
    jwt.verify(token, config.secretToken, (err, decodedToken) => {
        if (err) {
            return res.status(401).send({ message: "failed", error: "Invalid credentials" });
        }
        req.user = decodedToken;
        next();
    });
};

const authorization = async (req, res, next) => {
    const user = req.user;
    console.log(user)
    if (!user) {
        return res.status(403).send({ message: "failed", error: "Access denied" });
    }
    let userId = user.id; // Get the user ID from the token
    let id = req.params.userId; // Get the ID from the request parameters for current user
    if (userId !== id) {
        return res.status(403).send({ message: "failed", error: "Access denied" });
    }
    next();
};

export { authentication, authorization };