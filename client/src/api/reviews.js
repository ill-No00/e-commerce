import api from "./client";

export const reviewsApi = {
  list: (productId) =>
    api.get(`/reviews/${productId}`).then((r) => r.data),

  create: (body) => api.post("/reviews", body).then((r) => r.data),
};
