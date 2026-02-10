import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const res = await api.post("/api/auth/login", data);

  const token = res.data.token;
  localStorage.setItem("token", token);

  return jwtDecode(token); // contains role info
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload; // 🔥 important
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
