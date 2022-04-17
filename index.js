import express from "express"
import cors from "cors"
import { getFavs,login,postFav, postUser ,deleteFav} from "./routes.js"
import { authMiddleware, userMiddleware } from "./middleware.js"


const DEFAULT_PORT = 8000
const app = express()

app.use(express.json())
app.use(cors())
app.use(userMiddleware)


app.get("/favs",authMiddleware,getFavs)
app.post("/favs",authMiddleware,postFav)
app.delete("/favs/:id",authMiddleware,deleteFav)
app.post("/register",postUser)
app.post("/login",login)



app.listen(DEFAULT_PORT, ()=>{
    console.log("server working in port ",DEFAULT_PORT )
})
