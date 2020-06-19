const express=require('express');
const router=express.Router();

const ctrlUser=require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');
router.post('/register',ctrlUser.register);
router.post('/authenticate',ctrlUser.authenticate);
//to make jwt token private and to add token in header we will add jwt helper
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
module.exports=router;