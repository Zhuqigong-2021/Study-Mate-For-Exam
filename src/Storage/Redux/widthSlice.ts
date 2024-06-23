import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 0,
};

export const widthSlice = createSlice({
  name: "width",
  initialState: initialState,
  reducers: {
    setGlobalWidth: (state, action) => {
      state.width = action.payload;
    },
  },
});

export const { setGlobalWidth } = widthSlice.actions;
export const widthReducer = widthSlice.reducer;
