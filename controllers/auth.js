const User=require('../models/User')
const errorResponse=require('../utils/errorResponse');
const path=require('path');

//@desc Register User
//@Route Get /api/v1/auth/register
//@access Public

exports.register=async(req,res,next)=>{
    try{
        res.status(200).json({
            success:true
        })
    }catch(error){

    }
}