
require("dotenv").config();

const express=require("express");
const app=express();
const cors=require("cors");
const db=require("./db/connect")
const userRoutes=require("./routes/user.routes")
const authRouter=require("./routes/auth.routes")
//  middlewars
db()
app.use(express.json())
app.use(cors());
app.use(userRoutes)
app.use(authRouter)


const port=process.env.port||3000
app.get("/",(req,res)=>{
    res.status(200).send({message:"forget-password-task"})
})

app.listen(port,()=>{
    console.log("port is running",port)
})