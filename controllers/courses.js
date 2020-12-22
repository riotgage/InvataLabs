const { Mongoose } = require('mongoose');
const Course=require('../models/Course')
const Bootcamp=require('../models/Bootcamp')
const errorResponse=require('../utils/errorResponse');

//@desc Get All Courses
//@Route Get /api/v1/courses                           Routed from server
//@Route Get /api/v1/bootcamps/:bootcampId/courses     Routed from bootcamp router
//@access Public

exports.getCourses=async(req,res,next)=>{
    try{
        let query;
        if(req.params.bootcampId){
            const courses=await Course.find({bootcamp:req.params.bootcampId})
            return res.status(200).json({
                success:true,
                count:courses.length,
                data:courses
            })
        }
        else{
            query=Course.find()
            res.status(200).json(res.advancedResults)
        } 

       
    }catch(error){
        next(error)
    }
}


//@desc Get single Course
//@Route Get /api/v1/courses                           Routed from server
//@access Public

exports.getCourse=async(req,res,next)=>{
    try{
        let query;
        
        query=Course.findById(req.params.id)
        query.populate({
            path:'bootcamp',
            select:'name description'
        })

        const course=await query;
        if(!course){
            return next(new errorResponse("Course with id "+req.params.id+"not found",404))
        }
        res.status(200).json({
            success:true,
            data:course
        })
    }catch(error){
        next(error)
    }
}

//@desc  Add Course
//@Route POST /api/v1/bootcamps/:bootcampId/courses     
//@access Private

exports.addCourse=async(req,res,next)=>{
    try{
        req.body.bootcamp=req.params.bootcampId
        req.body.user=req.user.id
        const bootcamp=await Bootcamp.findById(req.params.bootcampId)
        if(!bootcamp){
            return next(new ErrorResponse("No Bootcamp with id "+req.params.bootcampId,404))
        }

        if(bootcamp.user.toString()!==req.user.id &&req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update this bootcamp`,401))
        }
        const course=await Course.create(req.body)


        res.status(200).json({
            success:true,
            data:course
        })
    }catch(error){
        next(error)
    }
}

//@desc Update a Course
//@Route UPDATE /api/v1/courses/:id
//@access Private

exports.updateCourse=async(req,res,next)=>{
    try{
        let course=await Course.findById(req.params.id)
        if(!course){
            return next(new ErrorResponse("No course found with id " + req.params.id,404))
        }
        if(course.user.toString()!==req.user.id &&req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update this course`,401))
        }
        course=await Course.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            data:course
        })
    }catch(error){
        next(error)
    }
}

//@desc Delete a Course
//@Route DELETE /api/v1/courses/:id
//@access Private

exports.deleteCourse=async(req,res,next)=>{
    try{
        course=await Course.findById(req.params.id)
        if(!course){
            return next(new ErrorResponse("No course found with id " + req.params.id,404))
        }
        if(course.user.toString()!==req.user.id &&req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update this course`,401))
        }
        await course.remove();
        res.status(200).json({
            success:true,
            data:{}
        })
    }catch(error){
        next(error)
    }
}

