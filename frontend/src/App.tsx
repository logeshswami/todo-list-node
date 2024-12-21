import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

axios.defaults.baseURL = "http://localhost:3000";

type Task = {
  id: string;
  taskName: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  importance: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
};

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    taskName: "",
    dueAt: "",
    importance: "medium",
  });
  const [filter, setFilter] = useState({
    status: "",
    importance: "",
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  //initial render
  useEffect(() => {
    fetchTasks();
  }, []);


  // fetch tsk api call
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/fetchAll");
      setTasks(response.data.todos);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  //create tsk api call
  const createTask = async () => {
    try {
      await axios.post("/addtask", {
        ...newTask,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      fetchTasks();
      setNewTask({ taskName: "", dueAt: "", importance: "medium" });
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  //update tsk api call
  const updateTask = async (updatedTask: Task) => {
    try {
      const { id, updatedAt, ...payload } = updatedTask;
      await axios.put(`/updateTask/${id}`, payload);
      fetchTasks();
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };


  // del task api call
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/deleteTask/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };
  
  // del all available task
  const deleteAll = async() => {
    try{
      await axios.delete("/deleteAllTask");
      fetchTasks();
    }
    catch(error){
      console.error("Error deleteing all task",error);
    }
  }

  // filter tsk weathere  match filter selected or id = current edit task
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filter.status === "" || task.status === filter.status;
    const matchesImportance = filter.importance === "" || task.importance === filter.importance;

   
    return (matchesStatus && matchesImportance) || editingTaskId === task.id;
  });

  // sort task by due date
  const sortedTasks = filteredTasks.sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen font-sans">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        Task Manager
      </h1>

      {/* create tsk form  */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Add New Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Task Name</label>
            <input
              type="text"
              placeholder="Enter task name"
              value={newTask.taskName}
              onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={newTask.dueAt}
              onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Importance</label>
            <select
              value={newTask.importance}
              onChange={(e) =>
                setNewTask({ ...newTask, importance: e.target.value as "low" | "medium" | "high" })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            onClick={createTask}
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* filter task based on filters selected */}
      <div className="flex justify-between items-center mb-6 max-w-xl mx-auto space-x-4">
        <select
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, importance: e.target.value })}
          className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Importance</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
        className="w-1/2 p-2 bg-red-600 rounded-md text-white hover:bg-red-800"
        onClick={()=>{deleteAll()}}
        >
          Delete All Task
        </button>
      </div>

      {/* render task lst , render based or edit task id */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white shadow-md rounded-lg p-6 border-l-4 ${
              task.importance === "high"
                ? "border-red-500"
                : task.importance === "medium"
                ? "border-yellow-500"
                : "border-green-500"
            }`}
          >
            {editingTaskId === task.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={task.taskName}
                  onChange={(e) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id ? { ...t, taskName: e.target.value } : t
                      )
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={task.dueAt.split("T")[0] /*extract date frm due date*/}
                  disabled={task.status === "completed"}
                  onChange={(e) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id ? { ...t, dueAt: e.target.value } : t
                      )
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={task.importance}
                  disabled = {task.status == "completed"}
                  onChange={(e) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id
                          ? {
                              ...t,
                              importance: e.target.value as "low" | "medium" | "high",
                              /*typ cast to any one of the 3 union usage*/
                            }
                          : t
                      )
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => updateTask(task)}
                  className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{task.taskName}</h3>
                <p className="text-sm text-gray-800">Due: {new Date(task.dueAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-800">
                  Importance:{" "}
                  <span
                    className={`font-semibold ${
                      task.importance === "high"
                        ? "text-red-600"
                        : task.importance === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {task.importance}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "in-progress"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {task.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            )}
            <div className="mt-4 flex space-x-2">
              {editingTaskId !== task.id && (
                <button
                  onClick={() => setEditingTaskId(task.id)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
                >
                  Edit
                </button>
              )}
              {task.status !== "completed" && (
                <button
                  onClick={() =>
                    updateTask({
                      ...task,
                      status:
                        task.status === "pending" ? "in-progress" : "completed",
                    })
                  }
                  className={`px-4 py-2 rounded-md w-full ${
                    task.status === "pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {task.status === "pending" ? "In Progress" : "Complete"}
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
