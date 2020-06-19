const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');

//In order to connect to mongo DB we will store User schema
var User=mongoose.model('User');

passport.use(
    //localStrategy is a constructor below
    new localStrategy({usernameField: 'email'},
    (username, password, done) => {
        User.findOne({ email:username},
            (err,user) =>{
                if (err){
                    return done(err);    
                }
                //unknown user
                else if (!user)
                    return done(null,false,{message:'Email is not registered'});
                //wrong password
                else if (!user.verifyPassword(password))
                    return done(null,false,{message:'Password is wrong'});
                else
                    return done(null,user);
            });
    })
);