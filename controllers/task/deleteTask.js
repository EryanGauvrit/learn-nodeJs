const Task = require("../../models/task");
const getTask = require("./getTask");

const deleteTask = async (userId, id) => {
    let response = { status: 404, data : "Not found" };
    try {
        const isExist = await getTask(id);
        if(isExist && isExist.status === 200 && isExist.data.user_id === Number(userId)){
            await Task.destroy({
                where: {
                    id: id
                }
            })
            .then(() => {
                response = {
                    status: 200,
                    data : "Deleted"
                }
            })
            .catch((err) => {
                throw err;
            })
        }
    }catch (err){
        throw err;
    }
    return response;
}

