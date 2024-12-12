/*import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: "tasks",
    initialState: [],
    reducers: {
        setTasks: (state, action) => action.payload,
        addTask: (state, action) => {
            state.push(action.payload);
        },
        updateTask: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.findIndex((task) => task.id === id);
            if (index !== -1) {
                state[index] = { ...state[index], ...updates };
            }
        },
    },
});

export const { setTasks, addTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;*/
// Assuming you are using Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state for tasks
const initialState = [];

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => {
      state.push(action.payload);
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload); // Remove task by id
    },
  },
});

export const { setTasks, addTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
