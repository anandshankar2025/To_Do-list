import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { addTask, setTasks, deleteTask } from "./redux/taskSlice"; // Import deleteTask action
import "./App.css";



const stages = ["To Do", "In Progress", "Peer Review", "Done"];

function App() {
    const tasks = useSelector((state) => state.tasks); // Fetch tasks from Redux store
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "" });

    useEffect(() => {
        // Load tasks from local storage on component mount
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        dispatch(setTasks(savedTasks));
    }, [dispatch]);

    useEffect(() => {
        // Save tasks to local storage whenever they are updated
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);
        movedTask.stage = result.destination.droppableId;
        updatedTasks.splice(result.destination.index, 0, movedTask);

        dispatch(setTasks(updatedTasks));
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const addNewTask = () => {
        if (newTask.title.trim() && newTask.description.trim()) {
            const newTaskObj = {
                id: Date.now().toString(),
                title: newTask.title,
                description: newTask.description,
                stage: "To Do", // Default stage
            };
            dispatch(addTask(newTaskObj));
            setShowForm(false);
            setNewTask({ title: "", description: "" });
        }
    };

    // Function to delete a task
    const deleteTaskHandler = (taskId) => {
        dispatch(deleteTask(taskId)); // Dispatch delete action to remove task from Redux store
    };

    return (
        <div className="App">
            <h1>Kanban Board</h1>
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box"
            />
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {stages.map((stage) => (
                        <Droppable key={stage} droppableId={stage}>
                            {(provided) => (
                                <div
                                    className="kanban-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2>{stage}</h2>
                                    <div className="kanban-tasks">
                                        {filteredTasks
                                            .filter((task) => task.stage === stage)
                                            .map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            className="kanban-task"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <h3>{task.title}</h3>
                                                            <p>
                                                                {task.description.length > 50
                                                                    ? `${task.description.slice(0, 50)}...`
                                                                    : task.description}
                                                            </p>
                                                            {/* Delete Button */}
                                                            <button
                                                                className="delete-button"
                                                                onClick={() => deleteTaskHandler(task.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            <div className="add-task-container">
                {showForm && (
                    <div className="task-form">
                        <h3>Create New Task</h3>
                        <input
                            type="text"
                            name="title"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={handleNewTaskChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Task Description"
                            value={newTask.description}
                            onChange={handleNewTaskChange}
                        ></textarea>
                        <button onClick={addNewTask}>Add Task</button>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                )}
                {!showForm && (
                    <button className="floating-button" onClick={() => setShowForm(true)}>
                        + Add Task
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;


