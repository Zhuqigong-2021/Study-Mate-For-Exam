import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  read: false,
};

export const readSlice = createSlice({
  name: "read",
  initialState: initialState,
  reducers: {
    setReadStatus: (state, action) => {
      state.read = action.payload;
    },
  },
});

export const { setReadStatus } = readSlice.actions;
export const readReducer = readSlice.reducer;
