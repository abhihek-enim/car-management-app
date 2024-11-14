import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
export const store = configureStore({
  reducer: {
    user: userReducer, // Add the reducer under a key named "user"
  },
});
