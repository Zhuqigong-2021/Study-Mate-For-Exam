import { configureStore } from "@reduxjs/toolkit";
import { starReducer } from "./starSlice";
import userApi from "@/Apis/userApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      starStore: starReducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
