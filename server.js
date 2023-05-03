const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const cookieParser =require("cookie-parser")
const {VerifyToken}=require("./utils/VerifyToken")
const urlRoutes = require("./routes/url.routes")
const authRoutes = require("./routes/auth.routes")


// middlewares
app.use(express.json());
app.use(cors({
    origin:process.env.frontend_url,
    credentials:true,
}));

app.use(cookieParser());
//custom imports

const databaseConnect = require("./Database/Connect");

app.use("/api",VerifyToken,urlRoutes);
app.use("/auth",authRoutes);

databaseConnect();


app.listen(process.env.port,()=>{
    console.log(`Server running in port ${process.env.port}`)
})

