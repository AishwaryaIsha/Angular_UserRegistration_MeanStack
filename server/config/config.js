//Check and declare Env. here

//If runing API in development
var env=process.env.NODE_ENV || 'development';

//If rinning API in Production use below
//NODE_ENV=production node app.js

//Fetch .env
var config=require('./config.json');
var envConfig=config[env];
// add env. config values to process.env
Object.keys(envConfig).forEach(key =>process.env[key]=envConfig[key]);