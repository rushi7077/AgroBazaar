import api from "./axios";
export const placeOrderApi = (items) => api.post("/api/orders", { items });
export const getMyOrdersApi = () => api.get("/api/orders/my");
export const getFarmerOrdersApi = () => api.get("/api/orders/farmer");