const express=require('express');
const{register,login,getCurrentUser,deleteUser}=require('../controllers/auth')
const {protect}=require('../middleware/auth')
const router=express.Router();

router.post('/register',register);
     
router.post('/login',login);

router.get('/currentuser',protect,getCurrentUser);

// router.post('/deleteUser',protect,deleteUser);

module.exports=router;