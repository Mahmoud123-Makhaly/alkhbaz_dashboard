import { createSlice } from '@reduxjs/toolkit';
import { getTaskList, addNewTask, updateTask, deleteTask } from './thunk';
export const initialState = {
  taskList: [],
};

const TasksSlice = createSlice({
  name: 'TasksSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTaskList.fulfilled, (state: any, action: any) => {
      state.taskList = action.payload.data;
      state.isTaskCreated = false;
      state.isTaskSuccess = true;
    });
    builder.addCase(getTaskList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTaskCreated = false;
      state.isTaskSuccess = true;
    });
    builder.addCase(addNewTask.fulfilled, (state: any, action: any) => {
      state.taskList.push(action.payload.data);
      state.isTaskCreated = true;
      state.isTaskAdd = true;
      state.isTaskAddFail = false;
    });
    builder.addCase(addNewTask.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTaskAdd = false;
      state.isTaskAddFail = true;
    });
    builder.addCase(updateTask.fulfilled, (state: any, action: any) => {
      state.taskList = state.taskList.map(task =>
        task._id.toString() === action.payload.data._id.toString() ? { ...task, ...action.payload.data } : task,
      );
      state.isTaskUpdate = true;
      state.isTaskUpdateFail = false;
    });
    builder.addCase(updateTask.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTaskUpdate = false;
      state.isTaskUpdateFail = true;
    });
    builder.addCase(deleteTask.fulfilled, (state: any, action: any) => {
      state.taskList = state.taskList.filter(task => task._id.toString() !== action.payload.task.toString());
      state.isTaskDelete = true;
      state.isTaskDeleteFail = false;
    });
    builder.addCase(deleteTask.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTaskDelete = false;
      state.isTaskDeleteFail = true;
    });
  },
});

export default TasksSlice.reducer;
