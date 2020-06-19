const mongoose=require('mongoose');
//use bcrypt for saltSecret
const bcrypt=require('bcryptjs');
//for defining generate JWT calling JWT pacakage
const jwt=require('jsonwebtoken');

var userSchema=new mongoose.Schema({
        fullName:{
            type:String,
            required:"Full Name Can\'t be empty"
        },
        email:{
            type:String,
            required:"Email Can\'t be empty",
            unique:true
        },
        password:{
            type:String,
            required:"Password Can\'t be empty",
            minlength:[4,"password must be 4 characters long"]
        },
        //saltSecret is used for encryption and decryption of password
        saltSecret:{
            type:String
        },
});

//custom Validation for email
userSchema.path('email').validate((val) => {
    emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
    return emailRegex.test(val);
    }, 'Invalid e-mail');


//Event for saltSecret
//If you specify schema.pre('remove'), Mongoose will register this middleware for doc.remove() by default. If you want to your middleware to run on Query.remove() use schema.pre('remove', { query: true, document: false }, fn).
userSchema.pre('save',function(next){
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(this.password,salt,(err,hash) =>{
            this.password=hash;
            this.saltSecret=salt;
            next();
        });
    });
});

//Methods to verify Password using passportConfig file .We will use instance menthod for this below
userSchema.methods.verifyPassword= function(password) {
    //calling bcrypt package to compare pain password and encrypted password.it will return true else false
    // . Here 'password' is plain password and this.password is encrypted password
    return bcrypt.compareSync(password,this.password);
};

//creating instance JWT to define generateJWT in userschema (JWT function)
userSchema.methods.generateJwt=function (){
    //sign is finction of JWT in this we will provide information like id,email
    return jwt.sign({_id:this._id},
    //send secret code for encryption and save the value in config.json
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}


//now register userSchema inside mongoose. In below code User is a collection name
mongoose.model('User',userSchema);

