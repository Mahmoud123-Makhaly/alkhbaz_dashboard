import { createSlice } from '@reduxjs/toolkit';
import { getApplicationList } from './thunk';

export const initialState = {
  appList: [],
  error: {},
};

const Jobslice = createSlice({
  name: 'Jobs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getApplicationList.fulfilled, (state: any, action: any) => {
      state.appList = action.payload;
    });
    builder.addCase(getApplicationList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
  },
});

export default Jobslice.reducer;
