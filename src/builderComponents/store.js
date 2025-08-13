import { configureStore } from "@reduxjs/toolkit";
import treeReducer from "./features/treeSlice";

export const store = configureStore({
    reducer: {
        tree: treeReducer,
    },
});

export default store;
