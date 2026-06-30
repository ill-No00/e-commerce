import api from "./client";

export const crewApi = {
  list: () => api.get("/crew").then((r) => r.data),

  join: (crewId) => api.post("/crew/join", { crew_id: crewId }).then((r) => r.data),

  getMembers: (crewId) => api.get(`/crew/${crewId}/members`).then((r) => r.data),

  getPosts: (crewId, params = {}) =>
    api.get(`/crew/${crewId}/posts`, { params }).then((r) => r.data),

  createPost: (body) => api.post("/crew/posts", body).then((r) => r.data),

  likePost: (postId) => api.post(`/crew/posts/${postId}/like`).then((r) => r.data),

  unlikePost: (postId) => api.delete(`/crew/posts/${postId}/like`),

  commentOnPost: (postId, body) =>
    api
      .post(`/crew/posts/${postId}/comments`, { body })
      .then((r) => r.data),

  getChat: (crewId, params = {}) =>
    api.get(`/crew/${crewId}/chat`, { params }).then((r) => r.data),

  sendChat: (crewId, body) =>
    api.post("/crew/chat", { crew_id: crewId, body }).then((r) => r.data),

  getMissions: (crewId) =>
    api.get(`/crew/${crewId}/missions`).then((r) => r.data),
};
