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

        sendResponse(user,200,res)
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
        console.log(`${isMatch}`.yellow)
 
        if(!isMatch){
            return next(new errorResponse(`Credentials are invalid`,401))
        }   
        sendResponse(user,200,res)
    }catch(error){
        next(error);
    }
}

exports.getCurrentUser=async(req,res,next)=>{
    try{
        if(!req.user){
            return next(new errorResponse("No user is logged in"))
        }

        res.status(200).json({
           success:true,
           data:req.user
       })
    }catch(error){
        next(error);
    }
}

// exports.deleteUser=async(req,res,next)=>{
//     try{
//         if(!req.user){
//             return next(new errorResponse("No user is logged in"))
//         }
//         const user=User.remove(req.user.id);
//         res.status(200).json({
//            success:true,
//            data:user
//        })
//     }catch(error){
//         next(error);
//     }
// }


const sendResponse =(user,statusCode,res)=>{
    const token=user.getJWTSignature();

    const options={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE *24*60*60*1000),
        httpOnly:true,
    }
    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }
    res
        .status(statusCode)
        .cookie('token',token,options)
        .json({
            success:true,
            token
        })
}
