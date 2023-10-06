const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next){
    const token = req.header('x_authToken');
    if(!token || token=="") return res.status(401).send("Access Denied");
    try{
        jwt.verify(token,config.get("jwtPrivateKey"), function(error, decoded){
            if(error) return res.status(400).send("Access Denied! Invalid Token");
            req.user = decoded;
            next();
        });
    }catch(e){
        console.log(e);
        return res.status(500).send("Unknown error occured!");
    }
}


module.exports = auth;