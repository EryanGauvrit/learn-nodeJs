var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mysql = require('../mysql');

function generateToken(id){
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

router.post('/signup', (req, res, next) => {

    const email = req.body.email;
    const display_name = req.body.display_name;
    const password = req.body.password;
    if(!email || !display_name || !password){
        res.status(400);
        res.send("Des informations sont manquantes");
        return
    }

    bcrypt.hash(password, 12).then(hashedPassword => {
        try {
            const query = `Insert into user (email, password, display_name ) Values ('${email}', '${hashedPassword}', '${display_name}')`;
            mysql(query, response => {
              if(response){
                res.status(201)
                res.send("Vous êtes enregistré !");
              }else{
                res.status(400)
                res.send("Une erreur est survenue.");
              }
            })
          } catch(err) {
            res.status(500);
            res.send(err);
          }
    })

})

router.post('/login', (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        res.status(400);
        res.send("L'email ou le mot de passe est incorrect.");
        return;
    }

    try {
        const query = `SELECT * from user WHERE email='${email}'`;
        mysql(query, response => {
          if(response.length === 0){
            res.status(400)
            res.send("L'email ou le mot de passe est incorrect.")
            return;
          }
          const user = response[0];
          bcrypt.compare(password, user.password).then(isOk => {
            if(!isOk){
                res.status(400)
                res.send("L'email ou le mot de passe est incorrect.")
            }else {
                delete user.password;
                return res.json({
                    'token': generateToken(user.id, user.email),
                    'user': user,
                });
            }

          })
        })
      } catch(err) {
        res.status(500);
        res.send(err);
      }
})

router.get('/token-test', (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                res.status(401);
                res.send("Vous n'avez pas l'autorisation.");
            }
            const userId = decode.id;
            const query = `SELECT * from user WHERE id='${userId}'`;
                mysql(query, response => {
                  if(response.length === 0){
                    res.status(401)
                    res.send("Vous n'avez pas l'autorisation.")
                    return;
                  }
                //   res.send(`Salut à toi ${response[0].display_name}`);
                  res.json(response[0]);
                })
        })
    }else{
        res.status(401);
        res.send("Vous n'avez pas l'autorisation.");
    }
    
})

module.exports = router;