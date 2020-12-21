const express=require('express');
const errorHandler=require('../middleware/error')
const {protect,roleAuthorize}=require('../middleware/auth')

//Bring in Controller Methods
const {getUser,getUsers,createUser,updateUser,deleteUser} = require('../controllers/users');
const User=require('../models/User')
const advancedResults=require('../middleware/advancedResults')
const router=express.Router({mergeParams:true});

router.use(protect);
router.use(roleAuthorize('admin'));

router
    .route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser)
router
    .route('/')
        .get(advancedResults(User),getUsers)
        .post(createUser)
module.exports=router