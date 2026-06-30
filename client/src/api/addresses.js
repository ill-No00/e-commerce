import api from "./client";

export const addressesApi = {
  list: () => api.get("/addresses").then((r) => r.data),

  create: (body) => api.post("/addresses", body).then((r) => r.data),

  update: (id, body) => api.put(`/addresses/${id}`, body).then((r) => r.data),

  remove: (id) => api.delete(`/addresses/${id}`),
};
