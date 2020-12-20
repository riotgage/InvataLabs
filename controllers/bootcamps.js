const { Mongoose } = require('mongoose');
const Bootcamp=require('../models/Bootcamp')
const errorResponse=require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const path=require('path');

//@desc Get All Bootcamps
//@Route Get /api/v1/bootcamps
//@access Public
exports.getBootcamps= async(req,res,next)=>{
    try{
        res.status(200).json(res.advancedResults)
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
        //Add user to req.body
        req.body.user =req.user.id

        // check for published Bootcamps
        const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
        if(publishedBootcamp && req.user.role!=='admin'){
            return next(new errorResponse(`${req.user.role} role can not create multiple bootcamps`,400))
        }
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
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))
        }
        if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update bootcamp `))
        }
        
        bootcamp.remove()
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
        let bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))
        }
        console.log(bootcamp)
        // Make sure request came from bootcamp publisher
        if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
            return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update bootcamp `))
        }
        bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            msg:bootcamp    
        });
    }catch(error){
        next(error)
    }
} 

//@desc Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
// https://docs.mongodb.com/manual/reference/operator/query/centerSphere/
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

//@desc Upload Photo for Bootcamp
//@Route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = async (req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`,400))
        }


      if(!req.files){
          return next(new errorResponse(`Please Upload a file`,400))
      }
      const file=req.files.file; 
      
      if(!file.mimetype.startsWith("image/")){
          return next(new errorResponse(`Image not found`,400))
      }
      
      // filesize validation
      if(file.size>process.env.MAX_FILE_SIZE){
          return next(new errorResponse(`File bigger than ${MAX_FILE_UPLOAD}, cannot process`,400))
      }
      if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
        return next(new errorResponse(`Permission error, user ${req.user.id} not authorized to update this bootcamp`,401))
    }
    
      // Customize filename
      file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;
      console.log(file.name) 
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async(err)=>{
        if(err){
            console.error(err)
            return next(new errorResponse(`Error with file upload`,500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
        res.status(200).json({
            success:true,
            data:file.name
        })
    
    }) 
    }catch(error){
        next(error)
    }
    
}