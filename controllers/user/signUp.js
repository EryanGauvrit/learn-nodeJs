const { User } = require('../../models/relations');

const signUp = async (email, password, display_name) => {

    let response = { status: 400, data : "Request is not valid" };

    if(password && email && display_name ){
        await User.create({
            email: email,
            password: password,
            display_name: display_name,
        })
        .then((user) => {
            response = {
                status: 200,
                data : 'Created'
            }
        })
        .catch((err) => {
            throw err;
        })
    }
    return response;
}

module.exports = signUp;