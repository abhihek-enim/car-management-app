import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const todo = {
        text: action?.payload,
      };
      state?.user?.push(todo);
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
