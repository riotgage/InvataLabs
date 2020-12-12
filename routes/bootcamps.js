const express=require('express');
const errorHandler=require('../middleware/error')

//Bring in Controller Methods
const { getBootcamp,getBootcamps,getBootcampsInRadius,createBootcamp,deleteBootcamp,updateBootcamp} = require('../controllers/bootcamps');

const router=express.Router();

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)
    
module.exports=router