const express=require('express');
const errorHandler=require('../middleware/error')

//Bring in Controller Methods
const {getCourses} = require('../controllers/courses');

const router=express.Router();


router
    .route('/')
    .get(getCourses)
    
module.exports=router