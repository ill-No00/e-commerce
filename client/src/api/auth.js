import api from "./client";

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  signup: (email, password, options) =>
    api.post("/auth/signup", { email, password, options }).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  getSession: () => api.get("/auth/session").then((r) => r.data),

  resetPassword: (email, redirectTo) =>
    api.post("/auth/reset-password", { email, redirectTo }).then((r) => r.data),
};
