
const users=require("../models/users.models");
const express=require("express");

const router=express.Router();

router.get("/users",(req,res)=>{
    res.status(200).send({message:"all users succefully retrived"})
})

module.exports=router;
