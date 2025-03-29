import {useEffect, useState} from 'react'
import { Trash2, Check } from "lucide-react";
import './App.css'

interface TaskData {
    id: number;
    text: string;
    completed: boolean;
}

function App() {
    const [tasksObj, setTasksObj] = useState<TaskData[]>([]);
    const [newTaskObj, setNewTaskObj] = useState<string>("");

    useEffect(() => {
        const fetchTasks = async() => {
            try {
                const response = await fetch("http://localhost:8080/api/tasks");

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data = await response.json();
                setTasksObj(data);
                console.log(data);
            }catch (error) {
                console.error("Failed to fetch tasks", error);
            }
        }
        fetchTasks();
    }, []) // empty, means load once on load


    const addTask = async (): Promise<void> => {
        if (newTaskObj.trim() === "") return;

        const newTaskForm = { text: newTaskObj };
        setNewTaskObj("");

        try {
            const response = await fetch("http://localhost:8080/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(newTaskForm),
            })

            if (!response.ok) {
                throw new Error("Failed to add task to server");
            }

            const data = await response.json();
            console.log("Task created on the server", data)
            setTasksObj([...tasksObj, data ]);
        } catch (error) {
            console.error("Failed to add task to server", error)
            // display, handle task
        }
    }

    const toggleComplete = async (index: number): Promise<void> => {
        const getTask = tasksObj.find((task) => task.id === index);

        if (!getTask) return; 

        const newTaskForm = {text: getTask.text, completed: !getTask.completed};

        try {
            const response = await fetch("http://localhost:8080/api/tasks/"+index, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(newTaskForm),
            })

            if(!response.ok) {
                throw new Error("Failed to update task to server");
            }
            const data = await response.json();
            console.log("Task updated on the server", data)
            const updatedTasks = tasksObj.map((_task) =>
                _task.id === index ? { ..._task, completed: data.completed } : _task
            );
            setTasksObj(updatedTasks);
        } catch(error) {
            console.error("Failed to update task to server", error);
        }
    };

    const deleteTask = async (index: number): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8080/api/tasks/" + index, {
                method: "DELETE",
                headers:  {
                    "Content-Type" : "application/json",
                }
            })

            if (!response.ok) {
                throw new Error("Failed to delete the task");
            }
            setTasksObj(tasksObj.filter((_task) => _task.id !== index));
        }catch (error) {
            console.error("Failed to delete the task", error);
            // display, handle task
        }
    };


    return (
        <div className="mx-auto p-4 bg-white shadow-lg rounded-2xl dark:bg-black">
            <h2 className="text-xl font-bold mb-4 text-left">To-Do List</h2>
            <div className="flex gap-2 mb-4">
                <input
                    value={newTaskObj}
                    onChange={(e) => setNewTaskObj(e.target.value)}
                    placeholder="Add a new task"
                    className="border w-lg p-2 rounded-md w-full"
                />
                <button className="px-4 py-2 rounded" onClick={addTask}>
                    Add
                </button>
            </div>
            <div>
                {tasksObj.map((_task: TaskData, _index: number) => (
                    <div key={_index} className={"mb-2"}>
                        <div className="flex justify-between items-center p-2 text-left">
                            <span className={_task.completed ? "line-through text-gray-500" : ""
                            }>
                                 {_task.text}
                            </span>
                            <div className={"flex gap-2"}>
                                <div
                                    className={"p-[0.2em] text-sm hover:bg-gray-200 rounded"}
                                    onClick={() => toggleComplete(_task.id)}>
                                    <Check className="text-green-600" />
                                </div>
                                <div
                                    className={"p-[0.2em] text-sm hover:bg-gray-200 rounded"}
                                    onClick={() => deleteTask(_task.id)}>
                                    <Trash2 className="text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default App
