const User=require('../models/User')
const errorResponse=require('../utils/errorResponse');
const path=require('path');
const colors=require('colors')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')
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

//@desc Get Logged in User
//@Route GET /api/v1/auth/login
//@access Public

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

//@desc Update User 
//@Route PUT /api/v1/auth/update
//@access Private

exports.updateUser=async(req,res,next)=>{
    try{
        delete req.body.password

        const user=await User.findByIdAndUpdate(req.user.id,req.body,{
            new:true,
            runValidators:true
        })
        
        res.status(200).json({
           success:true,
           data:user
       })
    }catch(error){
        next(error);
    }
}


//@desc Update User Password
//@Route PUT /api/v1/auth/updatePassword
//@access Private

exports.updateUserPassword=async(req,res,next)=>{
    try{

        const user=await User.findById(req.user.id).select('+password')
        if(!(await user.authPassword(req.body.currentPassword))){
            return next(new errorResponse("Password is not correct",404))
        }
        user.password=req.body.newPassword
        await user.save()
        sendResponse(user,200,res)
    }catch(error){
        next(error);
    }
}

//@desc Forgot Paassword
//@Route GET /api/v1/auth/forgotpassword
//@access Public

exports.forgotPassword=async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        console.log(`${user}`)
        if(!user){
            return next(new errorResponse(`If email is registered a email will be sent. `,401))
        }

        // Reset Token
        const resetToken=user.getResetPasswordToken()

        await user.save({
            validateBeforeSave:false
        })

        const resetUrl = `${req.protocol}://${req.get(
            'host',
          )}/api/v1/auth/resetpassword/${resetToken}`;
        
          const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
        
          try{
              await sendEmail({
                  email:user.email,  
                  subject:"Password reset token",
                  message
                })
                res.status(200).json({
                    success:true,
                    data:"Email Sent"
                })
          }catch(error){
              console.log(error)
              user.resetPasswordExpire=undefined
              user.resetPasswordToken=undefined

              await user.save({
                validateBeforeSave:false
            })
            return next(new errorResponse("Email Could not be sent",500))
          }
        
    }catch(error){
        next(error);
    }
}

//@desc Reset User Password
//@Route PUT /api/v1/auth/resetpassword/:token
//@access Public

exports.resetPassword=async(req,res,next)=>{
    try{
        const resetToken=crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex')


        const user=await User.findOne({
            resetPasswordExpire:{$gt:Date.now()},
            resetPasswordToken:resetToken
        })

        if(!user){
            return next(new errorResponse(`Token is invalid`,400))
        }

        //set New Password
        user.password=req.body.password;
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        await user.save()
        sendResponse(user,200,res)
    }catch(error){
        next(error);
    }
}



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
