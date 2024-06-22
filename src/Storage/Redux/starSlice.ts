import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  star: false,
};

export const starSlice = createSlice({
  name: "star",
  initialState: initialState,
  reducers: {
    setStar: (state, action) => {
      state.star = action.payload;
    },
  },
});

export const { setStar } = starSlice.actions;
export const starReducer = starSlice.reducer;
