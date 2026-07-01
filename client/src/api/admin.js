import api from "./client";

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard").then((r) => r.data ).catch((err) => {
    console.error("Error fetching dashboard data:", err);
    
  }),

  activityLog: (params = {}) =>
    api.get("/admin/dashboard/activity-log", { params }).then((r) => r.data),

  orders: (params = {}) =>
    api.get("/admin/orders", { params }).then((r) => r.data),

  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

  inventory: (params = {}) =>
    api.get("/admin/inventory", { params }).then((r) => r.data),

  createProduct: (body) =>
    api.post("/admin/inventory/products", body).then((r) => r.data),

  updateProduct: (id, body) =>
    api.put(`/admin/inventory/products/${id}`, body).then((r) => r.data),

  updateVariantStock: (productId, variantId, stockQuantity) =>
    api
      .put(`/admin/inventory/products/${productId}/variants/${variantId}/stock`, {
        stock_quantity: stockQuantity,
      })
      .then((r) => r.data),

  deleteProduct: (id) => api.delete(`/admin/inventory/products/${id}`),

  staff: () => api.get("/admin/staff").then((r) => r.data),

  inviteStaff: (body) =>
    api.post("/admin/staff/invite", body).then((r) => r.data),

  updateStaffRole: (id, role) =>
    api.put(`/admin/staff/${id}/role`, { role }).then((r) => r.data),

  removeStaff: (id) => api.delete(`/admin/staff/${id}`),

  storeSettings: () => api.get("/admin/settings/store").then((r) => r.data),

  updateStoreSettings: (body) =>
    api.put("/admin/settings/store", body).then((r) => r.data),

  notifications: () =>
    api.get("/admin/settings/notifications").then((r) => r.data),

  updateNotifications: (body) =>
    api.put("/admin/settings/notifications", body).then((r) => r.data),

  integrations: () =>
    api.get("/admin/settings/integrations").then((r) => r.data),

  connectIntegration: (id) =>
    api.put(`/admin/settings/integrations/${id}/connect`).then((r) => r.data),

  builderConfig: () =>
    api.get("/admin/settings/builder").then((r) => r.data),

  toggleBuilderStep: (id, isEnabled) =>
    api
      .put(`/admin/settings/builder/steps/${id}`, { is_enabled: isEnabled })
      .then((r) => r.data),

  updateBuilderSettings: (body) =>
    api.put("/admin/settings/builder/settings", body).then((r) => r.data),

  resetBuilderData: () =>
    api.post("/admin/settings/danger-zone/reset-builder-data").then((r) => r.data),
};
