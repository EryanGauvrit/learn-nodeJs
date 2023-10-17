
const jwt = require('jsonwebtoken');
const mysql = require('./mysql');

function authenticationMiddleware(req, res, next){

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                res.status(401);
                res.send("Vous n'avez pas l'autorisation.");
                return;
            }
            const userId = decode.id;
            const query = `SELECT id, email from user WHERE id='${userId}'`;
                mysql(query, response => {
                  if(response.length === 0){
                    res.status(401)
                    res.send("Vous n'avez pas l'autorisation.")
                    return;
                  }
                  req.user = response[0];         
                  next();
                })
        })
    }else{
        res.status(401);
        res.send("Vous n'avez pas l'autorisation.");
    }
}

module.exports = {
    authenticationMiddleware
}