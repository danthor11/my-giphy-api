import { Favs , SECRET_KEYWORD, User} from "./db.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const getFavs = async (req,res) =>{
    const {userToken = null} = req
    const username = userToken ? userToken.username : null
    
    try {
        
        if(username){

            const {gif_favorites_id} = Favs.find(f => f.username === userToken.username)
            res.json(gif_favorites_id)
            res.status(200)
        }
        else 
            throw ({message:"Unathorized, you need to be logged"})
    } catch (error) {
        
        res.status(401).json(error)
    }
} 

export const postFav = async(req,res) => {
    const { userToken=null , body} = req
    const {id} = body
    
    if(userToken){


        const itCanBeAdded = (idFav) => idFav === id
    
        const userExists = Favs.some(f => f.username === userToken.username)
        
        if(!userExists){
            Favs.push({username:userToken.username,gif_favorites_id:[]})
        }

        const {gif_favorites_id} = Favs.find(f => f.username === userToken.username)

        if(gif_favorites_id.some(itCanBeAdded))
            res.status(400).json({error:"Gif already exists"})
        else {
            gif_favorites_id.push(id)
            res.status(201).json(gif_favorites_id)
        }   
        
    }
    else{
        res.code(400).json({message:"User is not registered"})
    }

}


export const deleteFav = (req,res) => { 
    const {userToken} = req
    const {id} = req.params
    
    const userFavs = Favs.find(el => el.username === userToken.username)


    
    userFavs.gif_favorites_id = userFavs.gif_favorites_id.filter(favId => favId !== id)

    res.status(200).json(userFavs)

}




export const postUser = async(req,res) => {
    const {username,password} = req.body
    
    if(User.some(user => user.username===username)){
        res.status(409).json({error:"user isn´t available"})
    }     
    else{
        
        const passwordHash = await bcrypt.hash(password,10)
        
        const newUser = {
            username,
            password:passwordHash
        }
    
        User.push(newUser)
        
        res.status(201).json(User)
    }
}


export const login = async (req,res) => {
    const {body} = req
    const {password,username} = body
    
    try {
        const userDb = User.find(user => username === user.username)
        const isPasswordCorrect = await bcrypt.compare(password,userDb.password)
       
        if(isPasswordCorrect){
            const userForToken = {username: userDb.username}
            const token =  jwt.sign(
                userForToken,
                SECRET_KEYWORD,
                {
                    expiresIn: 60 * 24 * 7
                }
            )

            res.send({
                username:userDb.username,
                token 
            })
        }
        
    } catch (error) {
        res.status(409).json({error:"Invalid User o Password"})
    }

}

