const mongoose=require("mongoose");

const TokenSchema=mongoose.Schema({
    userId:{
type:String,
required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:600
    }
});

module.exports=mongoose.model("tokens",TokenSchema)