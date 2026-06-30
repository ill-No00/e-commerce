import api from "./client";

export const productsApi = {
  list: (params = {}) =>
    api.get("/products", { params }).then((r) => r.data),

  getBySlug: (slug) =>
    api.get(`/products/${slug}`).then((r) => r.data),
};
