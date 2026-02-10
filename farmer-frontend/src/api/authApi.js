import api from "./axios";
export const registerApi = (data) => api.post("/api/auth/register", data);
export const loginApi = (data) => api.post("/api/auth/login", data);