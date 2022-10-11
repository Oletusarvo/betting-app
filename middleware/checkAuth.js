const jwt = require('jsonwebtoken');

module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers.auth;
    if(token){
        jwt.verify(token, process.env.SERVER_TOKEN_SECRET, (err, user) => {
            if(err){
                res.status(403).send(err.message);
                return;
            }
            req.user = user;
            next();
        });
    }
    else{
        res.status(403).send('Token does not exist!');
    }
}