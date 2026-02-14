import api from "./axios";

/* USER */
export const placeOrderApi = (items) => api.post("/api/orders", { items });

export const getMyOrdersApi = () => api.get("/api/orders/my");


export const payOrderApi = (orderId) => api.put(`/api/orders/${orderId}/pay`);

/* FARMER */
export const getFarmerOrdersApi = async () => {
  const res = await api.get("/api/orders/farmer");
  return res.data;
};

/* ADMIN */
export const getAllOrdersApi = async () => {
  const res = await api.get("/api/orders");
  return res.data; // ⭐ VERY IMPORTANT
};

/* SELLER ACTIONS */
export const decideItemApi = (itemId, decision) =>
  api.put(`/api/orders/item/${itemId}/decision?decision=${decision}`);

export const completeItemApi = (itemId) =>
  api.put(`/api/orders/item/${itemId}/complete`);
