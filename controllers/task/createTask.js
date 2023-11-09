const { Task } = require('../../models/relations');

const createTask = async (title, due_date, description, user_id, done) => {
    let response = { status: 400, data : "Request is not valid" };
    console.log(user_id)
    if(title && due_date && description && user_id){
        await Task.create({
            title: title,
            due_date: due_date,
            description: description,
            userId: user_id,
            done: done,
        })
        .then((task) => {
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

module.exports = createTask;