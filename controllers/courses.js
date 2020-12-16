const { Mongoose } = require('mongoose');
const Course=require('../models/Course')
const errorResponse=require('../utils/errorResponse');

//@desc Get All Courses
//@Route Get /api/v1/courses                           Routed from server
//@Route Get /api/v1/bootcamps/:bootcampId/courses     Routed from bootcamp router
//@access Public

exports.getCourses=async(req,res,next)=>{
    try{
        let query;
        if(req.params.bootcampId){
            query=Course.find({bootcamp:req.params.bootcampId})
        }
        else{
            query=Course.find()
        } 
        // query.populate('bootcamp')

        const Courses=await query;

        res.status(200).json({
            success:true,
            count:Courses.length,
            data:Courses
        })
    }catch(error){
        next(error)
    }
}