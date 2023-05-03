const users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    try {
      const { password } = req.body;
  
      const isemailAvailable = await users.findOne({ email: req.body.email });
      if (isemailAvailable) {
        return res.status(403).send({ message: "Email already registered!" });
      }
        
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      await delete password;

      const activate_token = crypto.randomBytes(25).toString("hex");

      const registerUser = await new users({
        ...req.body,
        password: hashPassword,
        activation_token:activate_token,

      });
      await registerUser.save();

      const nodemailerFunction = async () => {
        try {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.from_email,
              pass: process.env.from_gpassword,
            },
          });

         const mailOptions = {
        from: process.env.from_email,
        to: registerUser.email,
        subject: "Url-Shortner - Account Activation",
        html: `
                      
                      <div>
                          <p>Dear ${registerUser.firstname}, Please click on the following link to activate your account</p>
                          <span><strong>Activation link:<i><strong>"${process.env.backend_url}/auth/activate/${activate_token}"</strong></i></span>
                          <div>
                              <p>- Url-Shortner support team</p>
                          </div>
                      </div>
                      
                      `,
      };

          await transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
              return res
                .status(500)
                .send({ message: "Error while sending email", error: err });
            }
          return res.status(201).send({ message: "Registeration successfully. Activation link sent to your email!"});
          });
        } catch (error) {
          return res
            .status(500)
            .send({ message: "Error triggering email!", error: error });
        }
      };

      nodemailerFunction();

    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error registering the user", error: error });
    }
  };

  const activateAccount = async(req,res)=>{
    try {
      const activation = await users.find({activation_token:req.params.activationtoken});
     
      if(!activation){
        return res.status(401).send({message:"Couldn't activate your account!!"})
      }
      
      const findUser = await users.findOneAndUpdate({activation_token:req.params.activationtoken},{account_status:true,activation_token:""},{new:true})
      
        await findUser.save();
        res.redirect(`${process.env.frontend_url}/login`);
    } catch (error) {
        return res.status(500).send({message:"Error while activation your account"})
    }
  }

  const login = async(req,res)=>{
    try {

      const userLogin = await users.findOne({email:req.body.email});

      if(userLogin){
        if(userLogin.account_status){
          const verifyPassword = await bcrypt.compare(req.body.password,userLogin.password);
          if(!verifyPassword){
            return res.status(401).send({message:"Incorrect password!"})
          }
          const token = jwt.sign({id:userLogin._id,email:userLogin.email},process.env.secret);
  
          res.cookie("accessToken", token, {
            httpOnly: false,
            sameSite: "none",
            secure: true,
            expire: new Date() + 86400000,
          });
          
          return res.status(201).send({message:"Login successful!",data:userLogin._id})
  
        }else{
          return res.status(401).send({message:"You have not verified your account"})
        }
      }else{
        return res.status(401).send({message:"Email not registered. Try registering!"})
      }

     


    } catch (error) {
      return res.status(500).send({message:"Error while signing in!"})
    }
  }

  const logout= async(req, res) => {
    
    await res.clearCookie('accessToken');
    return res.status(200).send({message:"Logged out"})   
    
  }

  module.exports = {register,activateAccount,login,logout};