const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    account_status:{
        type:Boolean,
        default:false,
    },
    temp_token:{
        type:Array,
    },
    activation_token:{
        type:String,
    },
    totalurl:{
        type:String,
    },
})

module.exports = mongoose.model("User",userModel);