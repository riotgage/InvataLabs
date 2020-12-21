const express=require('express');
const errorHandler=require('../middleware/error')
const {protect,roleAuthorize}=require('../middleware/auth')
//Bring in Controller Methods
const { getBootcamp,getBootcamps,getBootcampsInRadius,createBootcamp,deleteBootcamp,updateBootcamp,bootcampPhotoUpload} = require('../controllers/bootcamps');

const router=express.Router();
const advancedResults=require('../middleware/advancedResults')
const Bootcamp=require('../models/Bootcamp')
const courseRouter=require('./courses')
const reviewRouter=require('./reviews')
// If we get request api/v1/bootcamps/:bootcampId/courses route this to to courses router
// this will maintain integrity of api/v1/bootcamps integrity
// and all the course related reqs are handled by course router
router.use('/:bootcampId/courses',courseRouter)
router.use('/:bootcampId/reviews',reviewRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/:id/photo')
    .put(protect,roleAuthorize('publisher','admin'),bootcampPhotoUpload)
router
    .route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(protect,roleAuthorize('publisher','admin'),createBootcamp)

router
    .route('/:id')  
    .get(getBootcamp)
    .put(protect,roleAuthorize('publisher','admin'),updateBootcamp)
    .delete(protect,roleAuthorize('publisher','admin'),deleteBootcamp)
    
module.exports=router