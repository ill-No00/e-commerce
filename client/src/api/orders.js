import api from "./client";

export const ordersApi = {
  list: () => api.get("/orders").then((r) => r.data),

  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),

  getShippingMethods: () =>
    api.get("/orders/shipping-methods").then((r) => r.data),

  place: (body) => api.post("/orders", body).then((r) => r.data),
};
