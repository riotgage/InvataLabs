const express=require('express');
const errorHandler=require('../middleware/error')
const {protect,roleAuthorize}=require('../middleware/auth')
const {getReviews,getReview,addReview,updateReview,deleteReview}=require('../controllers/reviews');
const Review=require('../models/Review')
const advancedResults=require('../middleware/advancedResults')
const router=express.Router({mergeParams:true});

router
    .route('/')
    .get(advancedResults(Review,{
        path:'bootcamp',
        select:'name description'
    }),getReviews)
    .post(protect,roleAuthorize('user','admin'),addReview)

router
    .route('/:id')
    .get(getReview)
    .put(protect,roleAuthorize('user','admin'),updateReview)
    .delete(protect,roleAuthorize('user','admin'),deleteReview)

module.exports=router