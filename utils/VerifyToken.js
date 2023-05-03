const jwt = require("jsonwebtoken");
const express = require("express");
const app= express();
const users = require("../models/UserModel")
const cookieParser = require('cookie-parser');
app.use(cookieParser());




const VerifyToken = async(req,res,next)=>{
    try {
      
         const {cookies} = req;
         console.log(cookies,"cookies")
        const accessToken =req.cookies.accessToken;
        
        console.log(accessToken,"this");

        if(accessToken){
            let decryptedData = await jwt.verify(token,process.env.secret)
            console.log(decryptedData)
            if(!decryptedData){
                return res.status(401).send({ message: "Unauthorized" });
            }
            return next();
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:error})
    }
}

module.exports = {VerifyToken};