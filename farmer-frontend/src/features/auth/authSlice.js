import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";

/* ---------- Restore user from token on refresh ---------- */
const savedToken = localStorage.getItem("token");

let savedUser = null;

try {
  if (savedToken) {
    const decoded = jwtDecode(savedToken);

    // check expiry
    if (decoded.exp * 1000 > Date.now()) {
      savedUser = decoded;
    } else {
      localStorage.removeItem("token");
    }
  }
} catch {
  localStorage.removeItem("token");
}

/* ---------- LOGIN ---------- */
export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const res = await api.post("/api/auth/login", data);

  const token = res.data.token;
  localStorage.setItem("token", token);

  return jwtDecode(token); // contains role
});

/* ---------- SLICE ---------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    token: savedUser ? savedToken : null,
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
      state.user = action.payload;
      state.token = localStorage.getItem("token");
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
