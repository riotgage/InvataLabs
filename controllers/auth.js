const User=require('../models/User')
const errorResponse=require('../utils/errorResponse');
const path=require('path');

//@desc Register User
//@Route Get /api/v1/auth/register
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

        res.status(200).json({
            success:true
        })
    }catch(error){
        next(error);
    }
}

