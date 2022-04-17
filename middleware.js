import jwt from "jsonwebtoken"
import { SECRET_KEYWORD, User } from "./db.js"

export const userMiddleware = (req,res,next) =>{
    const {body} = req
    const token = body?.token ? body?.token : req.headers.authorization
   
    if(token){ 
        const decodedToken = jwt.verify(token,SECRET_KEYWORD)
   
        if(decodedToken){
            const user = User.find(u => u.username === decodedToken.username)
            if(user)
                req.userToken = user
        }
        next()
    }
    else{
        req.userToken =  null
        next()
    }
}

export const authMiddleware = (req,res,next) => {

    if(req.userToken){
        next()
    }
    else{
        res.status(405).json({message:"You need to be in Logged"})

    } 
}

