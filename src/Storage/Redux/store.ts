import { configureStore } from "@reduxjs/toolkit";
import { starReducer } from "./starSlice";
import userApi from "@/Apis/userApi";
import readApi from "@/Apis/readApi";
import { readReducer } from "./readSlice";
import { widthReducer } from "./widthSlice";
import inAppApi from "@/Apis/inAppApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      starStore: starReducer,
      readStore: readReducer,
      widthStore: widthReducer,
      [userApi.reducerPath]: userApi.reducer,
      [readApi.reducerPath]: readApi.reducer,
      [inAppApi.reducerPath]: inAppApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(readApi.middleware)
        .concat(inAppApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
