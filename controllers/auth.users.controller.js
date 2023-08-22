const users=require("../models/users.models");
const tokens=require("../models/token.model")
const bcrypt=require("bcrypt")
const crypto=require("crypto");
const { sendEmail } = require("../utils/sendEmail");
const { set } = require("mongoose");
const { error } = require("console");

exports.registerUser=async(req,res)=>{
    const {userName, Email,Password,}=req.body
  
    const oldUser=await users.findOne({Email})
    if(oldUser){
        return res.status(200).send({message:"user already exist"})
    }
    if(!userName){
        return res.status(200).send({message:"userName Required"})
    }
    if(!Email){
        return res.status(200).send({message:"userName Required"})
    }
    if(!Password){
        return res.status(200).send({message:"password Required"})
    }

    const saltingRounds=12;
const hashedPassword=await bcrypt.hash(Password,saltingRounds)


const newUser=await new  users({userName,Email,Password:hashedPassword})
if(!newUser){
    return res.status(400).send({message:"error while adding new users"})
}
await newUser.save().then((data) => {
    res.status(201).send({message:"users succefully registred",data,success:true})
}).catch((err) => {
    res.status(404).send({message:"internal error"})
    console.log(err)
});
    
};

exports.loginUsers=async(req,res)=>{

const {Email,Password}=req.body

if(!Email||!Password){
    return res.status(200).send({message:"email or password mandetory"})
}
const matchedUser=await users.findOne({Email})

if(!matchedUser){
   return res.status(200).send({message:"Email not Valid"})
}
const isValiduser=await bcrypt.compare(Password,matchedUser.Password)
if(!isValiduser){
   return res.status(200).send({message:"invalid password"})
}
res.status(201).send({message:"login successfully",
success:true,
userName:matchedUser.userName,
email:matchedUser.Email
})

};


exports.forgetPassword=async(req,res)=>{

    try{
        const {Email}=req.body
        if(!Email){
            return res.status(200).send({message:"email is mandatory"})
        }
        const usersDetails=await users.findOne({Email})
        
        if(!usersDetails){
            return res.status(200).send({message:"email is unvalid"})
        }
        const previousToken=tokens.find({ userId:usersDetails._id})
        if(previousToken){
        await previousToken.deleteOne()
        };
        
        const newToken= crypto.randomBytes(32).toString("hex")
        
        const hashedToken=await bcrypt.hash(newToken,12)
        
        
        const tokenPayload=await new tokens({ userId:usersDetails._id,token:hashedToken,createdAt:Date.now() })
        
        
        const savedToken=await tokenPayload.save()

      
        const link=`https://forget-password-task.netlify.app/reset-password?token=${newToken}&id=${usersDetails._id}`
        
   const sendingMail= await sendEmail(usersDetails.Email,"reset-password",{name:usersDetails.name,link})
  if(!sendEmail){
    return res.status(200).send({success:false,message:"error while sending message"})
  }
   res.status(201).send({success:true,message:"email was  sent successfully ",Token:savedToken})
  
}catch(er){
res.status(500).send({
    message:"internal server error "
})
console.log(er)
    }
};

exports.resetPassword=async(req,res)=>{
    try {
        const {userId}=req.params
        const {password}=req.body
        const {token}=req.headers
    
        const user=await tokens.findOne({userId})

        const verifiedToken = await bcrypt.compare(token,user.token);
        if(!verifiedToken){

            return res.status(200).send({success:false,message:"token not valid"})
        }
        const verifiedUser=await users.findOne({_id:userId})
 
        const  hashedNewPass=await bcrypt.hash(password,12)

        const updatedPassword = await users.findByIdAndUpdate(userId,
            {$set:{
                Password:hashedNewPass}},
            {new:true}
            )
       if(!updatedPassword){
        return res.status(200).send({message:"error while changing password"})
       }
       res.status(201).send({success:true,message:"password succefully changed"})

    } catch (error) {
        console.log(error)
    }
   



}