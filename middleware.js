const  jwt = require("jsonwebtoken");
const User = require('./models/user');

const authenticationMiddleware = (req, res, next) => {
    const headerAuth = req.headers.authorization;
    if(headerAuth && headerAuth.startsWith('Bearer')){
        const token = headerAuth.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if(err){
                res.status(401);
                res.send("Not authorized");
                return;
            }
            const userId = decode.id;
            await User.findByPk(userId)
                .then((userDb) => {
                    if(!userDb){
                        res.status(401);
                        res.json(userDb);
                        return;
                    }
                    req.user = userDb.id;
                    console.log(userDb)
                    next();
                    
                })
                .catch((err) => {
                    console.log(err)
                    res.status(401);
                    res.send("Not authorized");
                })
        })
    }else{
        res.status(401);
        res.send("Not authorized");
    }
}

module.exports = {
    authenticationMiddleware
}