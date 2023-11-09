const { Task } = require('../../models/relations');

const getAllTasks = async () => {
    let response = { status: 404, data : "Not found" };
    await Task.findAll()
        .then((tasks) => {
            response = tasks;
        })
        .catch((err) => {
            throw err;
        })
    return response; 
}

module.exports = getAllTasks;