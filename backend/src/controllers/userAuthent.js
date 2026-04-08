const redisClient = require('../config/redisClient');
const { findByIdAndDelete } = require('../models/problem');
const User =  require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//const redisClient = require("../config/redisClient")

const register = async (req,res)=>{

    try{
        validate(req.body);

        const {firstName, emailId, password}  = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        const user =  await User.create(req.body);
        const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});

         const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        
        res.status(201).res.status(200).json({
            user:reply,
            message:"Registered Successfully"
        });
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const login = async (req,res)=>{

    try{
        // const blocked = await redisClient.get(token);

        // if(blocked){
        //      throw new Error("Session expired. Please login again.");
        // }
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});
        if(!user) 
            throw new error("Invalid User");
        
        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});

        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        //frontend me jab user login karega toh usko user ko ux details bhej dia jaega

        res.status(201).json({
            user:reply,
            message:"logged-in Successfully"
        });
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}
// logOut feature
const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}
//admin can register admin only
const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const getProfile = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Unauthorized: No token");
        }

        // Check if token is blacklisted (logout case)
        const blocked = await redisClient.get(`token:${token}`);
        if (blocked) {
            return res.status(401).send("Session expired. Please login again.");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        const user = await User.findById(_id).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(401).send("Invalid Token");
    }
};

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {register,login,logout,adminRegister,getProfile,deleteProfile};
