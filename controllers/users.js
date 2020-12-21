const User=require('../models/User')
const errorResponse=require('../utils/errorResponse');
const crypto=require('crypto')
const advancedResults=require('../middleware/advancedResults')

//@desc Get All Users
//@Route GET /api/v1/auth/users
//@access Private/Admin

exports.getUsers=async(req,res,next)=>{ 
    try{
        res.status(200).json(res.advancedResults)
    }catch(error){
        next(error);
    }
}

//@desc Get Single User
//@Route POST /api/v1/users/:id
//@access Private/Admin

exports.getUser=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id);

        res.status(200).json({
            success:true,
            data:user
        })
    }catch(error){
        next(error);
    }
}

//@desc Create User
//@Route POST /api/v1/users/
//@access Private/Admin

exports.createUser=async(req,res,next)=>{
    try{
        const user=await User.create(req.body);
        
        res.status(201).json({
            success:true,
            data:user
        })
    }catch(error){
        next(error);
    }
}

//@desc Update User
//@Route Put /api/v1/users/:id
//@access Private/Admin

exports.updateUser=async(req,res,next)=>{
    try{
        const user=await User.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        
        res.status(201).json({
            success:true,
            data:user
        })
    }catch(error){
        next(error);
    }
}


//@desc Delete User
//@Route DELETE /api/v1/users/:id
//@access Private/Admin

exports.deleteUser=async(req,res,next)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        
        res.status(201).json({
            success:true,
            data:{}
        })
    }catch(error){
        next(error);
    }
}

