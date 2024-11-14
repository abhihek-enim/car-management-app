import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    username: "",
    email: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      console.log(action.payload, "in the reducer");
      state.user = {
        username: action.payload.username,
        email: action.payload.email,
      };
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
