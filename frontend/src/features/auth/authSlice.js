import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {},
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = "succeeded";
    },
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = "failed";
    },
  },
);

export const { loginUser, logout, setError } = authSlice.actions;
export default authSlice.reducer;
