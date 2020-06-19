const mongoose=require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User=mongoose.model('User');

module.exports.register=(req,res,next) =>{
    const user= new User();
    //below code is to push the below filed in db on post
    user.fullName=req.body.fullName;
    user.email=req.body.email;
    user.password=req.body.password;
    user.save((err,doc) =>{
        if(!err)
            res.send(doc);
        else{
            if(err.code ==11000)
                res.status(422).send(['Duplicate Email Address Found']);
            else
                return next(err);
            }
    });
}

//this router function will be used to send user and credentials for authentication and JWT creation
module.exports.authenticate = (req,res,next) => {
    //call for passport authentication
    passport.authenticate('local',(err,user,info)=>{
        //error from passportConfig.js middleware
        if (err) return res.status(400).json(err);
        //for registered user generate Token and define generateJWT in user schema in user.model.js
        else if(user) return res.status(200).json({ "token":user.generateJwt() });
        //for unknow user it will response from passportConfig.js middleware else(!user) in info value
        else return res.status(404).json(info);
    })(req,res);
}

//to create the route on authentication we will define function user profile
module.exports.userProfile = (req, res, next) =>{
    //In order to retrive the new user ID from mongoose we will use findOne mongoose function and provide id equal to user record id
    //which we already decoded and stored in _id property of jwt.verify function in jwtHelper
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
            //pick is a fuction of loadash to pick json data
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}