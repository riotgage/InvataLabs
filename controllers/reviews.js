const { Mongoose } = require('mongoose');
const Review=require('../models/Review')
const Bootcamp=require('../models/Bootcamp')
const errorResponse=require('../utils/errorResponse');

//@desc Get All Reviews
//@Route Get /api/v1/reviews                           Routed from server
//@Route Get /api/v1/bootcamps/:bootcampId/reviews     Routed from bootcamp router
//@access Public

exports.getReviews=async(req,res,next)=>{
    try{
        let query;
        if(req.params.bootcampId){
            const reviews=await Review.find({bootcamp:req.params.bootcampId})
            return res.status(200).json({
                success:true,
                count:reviews.length,
                data:reviews
            })
        }
        else{
            query=Review.find()
            res.status(200).json(res.advancedResults)
        } 

       
    }catch(error){
        next(error)
    }
}

//@desc Get A Review
//@Route Get /api/v1/review/:id                         
//@access Public

exports.getReview=async(req,res,next)=>{
    try{
        const review = await Review.findById(req.params.id).populate({
            path:'bootcamp',
            select:'name description'
        });
        if(!review){
            return next(new errorResponse(`No reviwe found with id ${req.params.id}`,404))
        }
        res.status(200).json({
            success:true,
            data:review
        })
       
    }catch(error){
        next(error)
    }
}

//@desc Post A Review
//@Route POST /api/v1/bootcamps/:bootcampId/reviews                         
//@access Private

exports.addReview=async(req,res,next)=>{
    try{
        req.body.bootcamp=req.params.bootcampId;
        req.body.user=req.user.id;

        const bootcamp=await Bootcamp.findById(req.params.bootcampId);

        if(!bootcamp){
            return next(new errorResponse(`No bootcamp with id of ${req.params.bootcampId}`,404))
        }

        const review=await Review.create(req.body);
        res.status(200).json({
            success:true,
            data:review
        })
       
    }catch(error){
        next(error)
    }
}

//@desc Update A Review
//@Route PUT /api/v1/reviews/:id                         
//@access Private

exports.updateReview=async(req,res,next)=>{
    try{
        let review=await Review.findById(req.params.id);

        if(!review){
            return next(new errorResponse(`No Review with id of ${req.params.id}`,404))
        }

        //Make sure review belongs to current user or user is an admin
        if(review.user.toString()!== req.user.id && req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user not authorized to update Review`,401))
        }
        review=await Review.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            data:review
        })
       
    }catch(error){
        next(error)
    }
}

//@desc Delete A Review
//@Route DELETE /api/v1/reviews/:id                         
//@access Private

exports.deleteReview=async(req,res,next)=>{
    try{
        let review=await Review.findById(req.params.id);

        if(!review){
            return next(new errorResponse(`No Review with id of ${req.params.id}`,404))
        }

        //Make sure review belongs to current user or user is an admin
        if(review.user.toString()!== req.user.id && req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user not authorized to update Review`,401))
        }
        await review.remove()
        res.status(200).json({
            success:true,
            data:{}
        })
       
    }catch(error){
        next(error)
    }
}
