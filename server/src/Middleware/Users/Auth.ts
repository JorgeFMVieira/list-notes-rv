import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export default (req: any, res: any, next: any) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.json({
            success: false,
        });
    }
    try {
        if(token){
            const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
            req.user = decoded;
            res.status(200).json({
                user: req.user,	
            });
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Algo inesperado aconteceu, contacte um administrador."
        });
    }
    return next();
};