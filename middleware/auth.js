import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized request')
        }
        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.SECRET);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        };
        next();
    } catch (error) {
        console.error(error);
    }
};

export default auth;