import {useEffect, useState} from 'react'
import './App.css'
import { Trash2, Check } from "lucide-react";

interface Task {
    text: string;
    completed: boolean;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");

    const addTask = async (): Promise<void> => {
        if (newTask.trim() === "") return;

        const newTaskObj = { text: newTask, completed: false };
        setTasks([...tasks, newTaskObj ]);
        setNewTask("");

        try {
            const response = await fetch("http://localhost:8080/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTaskObj),
            })

            if (!response.ok) {
                throw new Error("Failed to add task to server");
            }

            const data = await response.json();
            console.log("Task created on the server", data)
        } catch (error) {
            console.error("Failed to add task to server", error)
            // display, handle task
        }
    };

    const toggleComplete = (index: number): void => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const deleteTask = (index: number): void => {
        setTasks(tasks.filter((_, i) => i !== index));
    };


    return (
        <div className="mx-auto p-4 bg-white shadow-lg rounded-2xl dark:bg-black">
            <h2 className="text-xl font-bold mb-4 text-left">To-Do List</h2>
            <div className="flex gap-2 mb-4">
                <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                    className="border w-lg p-2 rounded-md w-full"
                />
                <button className="px-4 py-2 rounded" onClick={addTask}>
                    Add
                </button>
            </div>
            <div>
                {tasks.map((_task: Task, _index: number) => (
                    <div key={_index} className={"mb-2"}>
                        <div className="flex justify-between items-center p-2 text-left">
                            <span className={_task.completed ? "line-through text-gray-500" : ""
                            }>
                                 {_task.text}
                            </span>
                            <div className={"flex gap-2"}>
                                <div
                                    className={"p-[0.2em] text-sm hover:bg-gray-200 rounded"}
                                    onClick={() => toggleComplete(_index)}>
                                    <Check className="text-green-600" />
                                </div>
                                <div
                                    className={"p-[0.2em] text-sm hover:bg-gray-200 rounded"}
                                    onClick={() => deleteTask(_index)}>
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
