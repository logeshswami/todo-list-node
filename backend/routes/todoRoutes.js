const express = require("express");
const {validate} = require("../middlewares/validate");
const {fetchAllTask, createTask, updateTask,deleteTask,deleteAllTask} = require("../controllers/todoController");

const router = express.Router();

router.post("/addtask",validate,createTask);
router.get("/fetchAll",fetchAllTask);
router.put("/updateTask/:id",validate,updateTask);
router.delete("/deleteTask/:id",deleteTask);
router.delete("/deleteAllTask",deleteAllTask);
router.get('/', (req, res) => {
    res.status(200).json({ message: "hi this is a simple todo list crud app" });
});

//console.log(createTask);
module.exports = {router};
