const {Todo} = require("../models/todo");

const fetchAllTask = async(req,res) => {
    try{
        const tasks = await Todo.findAll();
        if(tasks.length ===0){
            return res.status(200).json({
                message : "no tasks are currently available",
                todos : [],
                error_obj:null,
            });
        }
        res.status(200).json({
            message: "tasks fetched successfully",
            todos : tasks,
            error_obj : null,
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message : "server error",
            todos : [],
            error_obj:error,
        });
    }
};

const createTask = async(req,res) => {
    try{
        const todo = await Todo.create({...req.body});
        res.status(201).json({
            message : "task added successfully",
            todo : todo,
            error_obj : null,
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message: "error during adding task",
            todo : [],
            error_obj : error,
        });
    }
};

const updateTask = async (req,res) => {
    const {id} = req.params;
    console.log(req.params);
    try{
        const todo = await Todo.findByPk(id);
        if(!todo){
            return res.status(404).json({
                message : "todo with given id not available",
                todo : [],
                error_obj:null,
            });
        }
        await todo.update(req.body); // updt with intance insted of Todo schema nd where cls
        res.status(200).json({
            message : "task updated successfully",
            todo : todo,
            error_obj : null,
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message : "error occured during updation of task",
            todo : [],
            error_obj : error,
        });
    }
};

const deleteTask = async(req,res) =>
{
    const {id} = req.params;
    
    try{
        const todo = await Todo.findByPk(id);
        if(!todo){
            return res.status(404).json({
                message : "no task was available with the given idd",
                todo : [],
                error_obj : null,
            });
        }
        await todo.destroy();
        res.status(200).json({
            message : "task deleted sucessfully",
            error_obj : null,
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message : "erroe occured while deleting the task",
            error_obj :error,
        });

    }
}

const deleteAllTask = async(req,res) => {
    try{
        await Todo.destroy({truncate:true,});
        res.status(200).json({
            message : "all tasks were clerad",
            error_obj : null , 
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message : "error occured while truncating",
            error_obj : error,
        });
    }
};

module.exports = {
    fetchAllTask,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTask,
};
