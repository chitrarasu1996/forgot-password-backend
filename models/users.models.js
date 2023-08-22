const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    Email:{
        type:String,
        required:true,
        unique: true,
        trim:true,
    },
    Password:{
        type:String,
        required:true,
    }
});

module.exports=mongoose.model("users",userSchema);
