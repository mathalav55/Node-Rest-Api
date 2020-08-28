const jwt = require('jsonwebtoken');
const config = require('../../config');
const secretKey = (process.env.NODE_ENV === "production")?process.env.secretKey:config.secretKey;
module.exports = ( req , res , next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode = jwt.verify( token , secretKey);
        req.userData = decode ;
        next();
    }catch(err){
        return res.status(409).json({
            message : "Auth Failed"
        });
    }
};