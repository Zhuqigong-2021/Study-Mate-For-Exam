import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  read: false,
};

export const readSlice = createSlice({
  name: "read",
  initialState: initialState,
  reducers: {
    readStatus: (state) => {
      state.read = true;
    },
  },
});

export const { readStatus } = readSlice.actions;
export const readReducer = readSlice.reducer;
