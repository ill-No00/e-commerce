import api from "./client";

export const paymentMethodsApi = {
  list: () => api.get("/payment-methods").then((r) => r.data),

  create: (body) => api.post("/payment-methods", body).then((r) => r.data),

  remove: (id) => api.delete(`/payment-methods/${id}`),
};
