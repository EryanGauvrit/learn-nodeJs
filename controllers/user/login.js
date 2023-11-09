const jwt = require('jsonwebtoken');
const { User } = require('../../models/relations');
const bcrypt = require('bcrypt');


function generateToken(id){
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

const login = async (email, password) => {
    let response = { status: 400, data: {message : "Invalid email or password"} };
    const user = await User.findOne({where: {email: email} });
    if(user){
        const validation = await bcrypt.compare(password, user.password);
        if(validation){
            return response = {
                status: 200,
                data: {
                    message: 'user authentication successful',
                    token: `Bearer ${generateToken(user.id, user.email)}`,
                    user: user
                }
            }
        }
    }
    return response;
}

module.exports = login;