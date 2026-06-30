import api from "./client";

export const wishlistApi = {
  list: () => api.get("/wishlist").then((r) => r.data),

  add: (variantId) =>
    api.post("/wishlist", { variant_id: variantId }).then((r) => r.data),

  remove: (id) => api.delete(`/wishlist/${id}`),
};
