import api from "./api";

export const placeOrder = async (formData) => {
  const response = await api.post("/orders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/me");
  return response.data;
};

export const getBankInfo = async () => {
  const response = await api.get("/config/bank");
  return response.data;
};

export const resubmitReceipt = async (orderId, formData) => {
  const response = await api.put(`/orders/${orderId}/resubmit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


