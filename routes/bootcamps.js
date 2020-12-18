const express=require('express');
const errorHandler=require('../middleware/error')

//Bring in Controller Methods
const { getBootcamp,getBootcamps,getBootcampsInRadius,createBootcamp,deleteBootcamp,updateBootcamp,bootcampPhotoUpload} = require('../controllers/bootcamps');

const router=express.Router();
const advancedResults=require('../middleware/advancedResults')
const Bootcamp=require('../models/Bootcamp')
const courseRouter=require('./courses')

// If we get request api/v1/bootcamps/:bootcampId/courses route this to to courses router
// this will maintain integrity of api/v1/bootcamps integrity
// and all the course related reqs are handled by course router
router.use('/:bootcampId/courses',courseRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/:id/photo')
    .put(bootcampPhotoUpload)
router
    .route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)
    
module.exports=router