const express=require('express');
const errorHandler=require('../middleware/error')
const {protect,roleAuthorize}=require('../middleware/auth')

//Bring in Controller Methods
const {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require('../controllers/courses');
const Course=require('../models/Course')
const advancedResults=require('../middleware/advancedResults')
const router=express.Router({mergeParams:true});


router
    .route('/:id')
    .get(getCourse)
    .put(protect,roleAuthorize('publisher','admin'),updateCourse)
    .delete(protect,roleAuthorize('publisher','admin'),deleteCourse)

router
    .route('/')
    .get(advancedResults(Course,{
        path:'bootcamp',
        select:'name description'
    }),getCourses)
    .post(protect,roleAuthorize('publisher','admin'),addCourse)

module.exports=router