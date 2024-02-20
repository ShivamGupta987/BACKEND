import AppError from "../utils/error.utils.js";
import jwt from "jsonwebtoken";


const isLoggedIn = async (req,res,next) =>{
    const {token} = req.cookies;

    if(!token){
        return new(AppError('token not find',400))
    }

    const userDetails = await jwt.verify(token,process.env.JWT_SECRET);
    req.user = userDetails;
    next();

}

export{
    isLoggedIn
}