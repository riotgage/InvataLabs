const { Mongoose } = require('mongoose');
const Bootcamp=require('../models/Bootcamp')
const errorResponse=require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

//@desc Get All Bootcamps
//@Route Get /api/v1/bootcamps
//@access Public
exports.getBootcamps= async(req,res,next)=>{
    try{
        const bootcamps=await Bootcamp.find();
        res.status(200).json({
            success:true,
            count:bootcamps.length, 
            msg:bootcamps
        });
    }catch(error){
        next(error)
    }

}

//@desc Get One Bootcamp
//@Route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp= async(req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))
        }
        res.status(200).json({
            success:true,
            msg:bootcamp
        });
    }catch(error){
       
        next(error) 
    }
}

//@desc Create new Bootcamp
//@Route POST /api/v1/bootcamps/
//@access Private
exports.createBootcamp=async (req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.create(req.body)
        res.status(201).json({
            success:true,     
            data:bootcamp  
        }) 
    }catch(error){
        next(error)
    }
    
}

//@desc Delete Bootcamp
//@Route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp=async (req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))

        }
        res.status(200).json({
            success:true,
            msg:"Deleting Bootcamp",
            body:bootcamp
        });
    }catch(error){
        next(error)
    }
    
}

//@desc Update Bootcamp     
//@Route PUT /api/v1/bootcamps/:id
//@access Private 
exports.updateBootcamp= async(req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
            next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))
        }
        res.status(200).json({
            success:true,
            msg:bootcamp    
        });
    }catch(error){
        next(error)
    }
} 

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    try{
        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        });
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    }
    catch(error){
        next(error)
    }
};