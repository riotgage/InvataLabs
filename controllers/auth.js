const User=require('../models/User')
const errorResponse=require('../utils/errorResponse');
const path=require('path');
const colors=require('colors')
//@desc Register User
//@Route POST /api/v1/auth/register
//@access Public

exports.register=async(req,res,next)=>{ 
    try{
        const {name,email,password,role}=req.body;
        
        //create user
        const user= await User.create({
            name,
            email,
            password,
            role
        });

        // Create token
        const token=user.getJWTSignature()
        res.status(200).json({
            success:true,
            token
        })
    }catch(error){
        next(error);
    }
}

//@desc Login User
//@Route POST /api/v1/auth/login
//@access Public

exports.login=async(req,res,next)=>{
    try{
        const {email,password}=req.body; 
        if(!email || !password){
            return next(new errorResponse(`Email and Password are required`,400))
        }

        const user=await User.findOne({email}).select('+password'); 

        if(!user){
            return next(new errorResponse(`Credentials are invalid`,401))
        }
        const isMatch= await user.authPassword(password); 
        console.log(isMatch.yellow)
 
        if(!isMatch){
            return next(new errorResponse(`Credentials are invalid`,401))
        }   
        
        // Create token
        const token=user.getJWTSignature()

        res.status(200).json({
            success:true,
            token
        })
    }catch(error){
        next(error);
    }
}

