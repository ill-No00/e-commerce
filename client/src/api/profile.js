import api from "./client";

export const profileApi = {
  get: () => api.get("/profile").then((r) => r.data),

  update: (body) => api.put("/profile", body).then((r) => r.data),
};
