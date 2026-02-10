import api from "./axios";
export const getProductsApi = () => api.get("/api/products");
export const getProductByIdApi = (id) => api.get(`/api/products/${id}`);