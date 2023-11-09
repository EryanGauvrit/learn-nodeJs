const { Task } = require('../../models/relations');
const getTask = require('./getTask');

const updateTask = async (userId, id, title, due_date, description, user_id, done) => {
    let response = { status: 400, data : "Request is not valid" };
    try{
        if(title || due_date || description || user_id || done){
            const isExist = await getTask(id);
                if(isExist && isExist.status === 200 && isExist.data.user_id === Number(userId)){
                await Task.update({
                    title: title,
                    due_date: due_date,
                    description: description,
                    user_id: user_id,
                    done: done
                }, {
                    where: {
                        id_task: id
                    }
                })
                .then(() => {
                    response = {
                        status: 200,
                        data : "Updated"
                    }
                })
                .catch((err) => {
                    throw err;
                })
            }else{
                response = {
                    status: 404,
                    data : "Not found"
                }
            }
        }
    }catch (err){
        throw err;
    }
    return response;
}

module.exports = updateTask;