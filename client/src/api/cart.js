import api from "./client";

export const cartApi = {
  get: () => api.get("/cart").then((r) => r.data),

  addItem: (variantId, quantity, unitPriceCents) =>
    api
      .post("/cart/items", {
        variant_id: variantId,
        quantity,
        unit_price_cents: unitPriceCents,
      })
      .then((r) => r.data),

  updateItem: (id, quantity) =>
    api.put(`/cart/items/${id}`, { quantity }).then((r) => r.data),

  removeItem: (id) => api.delete(`/cart/items/${id}`),

  clear: () => api.delete("/cart"),
};
