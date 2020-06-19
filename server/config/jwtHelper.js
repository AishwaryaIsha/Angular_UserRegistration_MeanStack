const jwt = require('jsonwebtoken');
//to make user profile router as private router.
module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    //In order to consume the private token created in index.route is below:
    if ('authorization' in req.headers)
       //extract token from request header. Spilt will split bearer and JWT token
        token = req.headers['authorization'].split(' ')[1];
    //If token stored in this variable or not
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            //decoded informations from payload 
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {
                    req._id = decoded._id;
                    //since we have token in header we can allow original function to handle this request
                    next();
                }
            }
        )
    }
}