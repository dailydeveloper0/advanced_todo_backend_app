function isAdmin(req, res, next){
    if(req.user && req.user.role == 'admin'){
        return next();
    }
    res.status(403).send("Access Denied! Not Admin");
}

module.exports.isAdmin = isAdmin;