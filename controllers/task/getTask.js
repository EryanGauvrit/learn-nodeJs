const { Task } = require('../../models/relations');

const getTask = async (id) => {
    let response = { status: 404, data : "Not found" };
    await Task.findByPk(id)
        .then((task) => {
            if(task){
                response = {
                    status: 200,
                    data : task
                }
            }
        })
        .catch((err) => {
            throw err;
        })
    return response;
}

module.exports = getTask;