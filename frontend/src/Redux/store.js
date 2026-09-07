import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice";
import messageReducer from "./messageSlice"
import artifactReducer from "./artifactSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        conversation: conversationReducer,
        message: messageReducer,
        artifact: artifactReducer,
    },
});

export default store;
