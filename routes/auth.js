const express=require('express');
const{register,login,logout,getCurrentUser,updateUserPassword,forgotPassword,updateUser,resetPassword}=require('../controllers/auth')
const {protect}=require('../middleware/auth')
const router=express.Router();

router.post('/register',register);
     
router.post('/login',login);

router.get('/logout',protect,logout);

router.get('/currentuser',protect,getCurrentUser);
router.put('/resetpassword/:token',resetPassword)
router.put('/updateuser',protect,updateUser)
router.put('/updateUserPassword',protect,updateUserPassword)
router.get('/forgotpassword',forgotPassword);

module.exports=router;