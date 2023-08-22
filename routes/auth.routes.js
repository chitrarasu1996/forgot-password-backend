const express=require("express");
const { registerUser,loginUsers, forgetPassword, resetPassword } = require("../controllers/auth.users.controller");

const router=express.Router();


router.post("/users/resgister",registerUser)

router.post("/user/login",loginUsers)

router.post("/user/forget-password",forgetPassword)

router.post("/user/reset-password/:userId",resetPassword)
module.exports=router