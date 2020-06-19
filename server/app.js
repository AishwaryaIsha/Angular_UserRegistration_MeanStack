require('./config/config');
require('./models/db');
require('./config/passportConfig'); //for authentication


const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const passport=require('passport'); //for authentication
const rtsIndex=require('./routes/index.router');

//middleware
var app=express();
app.use(bodyParser.json()); //To pass json data to node JS application
app.use(cors()); //To enable comm. btw API and angular
app.use(passport.initialize()); //initialize is a function for authentication
app.use('/api',rtsIndex);

//to get error in postman
app.use((err,req,res,next) =>{
if (err.name === 'ValidationError') {
    var valErrors =[];
    Object.keys(err.errors).forEach(key =>valErrors.push(err.errors[key].message));
    res.status(422).send(valErrors)
    }
});


//Start Server
//app.listen(process.env.PORT,() =>console.log('Server started at port:'+ process.env.PORT));
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
