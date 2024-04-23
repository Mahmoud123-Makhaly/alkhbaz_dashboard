import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
};

const forgotPasswordSlice = createSlice({
  name: 'forgotpwd',
  initialState,
  reducers: {
    userForgetPasswordSuccess(state: any, action: any) {
      state.forgetSuccessMsg = action.payload;
    },
    userForgetPasswordError(state: any, action: any) {
      state.forgetError = action.payload;
    },
  },
});

export const { userForgetPasswordSuccess, userForgetPasswordError } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
