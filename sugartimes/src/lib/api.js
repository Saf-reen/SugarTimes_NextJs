import axiosInstance from "./axiosInstance";

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => axiosInstance.post("/auth/login", data),
  register: (data) => axiosInstance.post("/auth/register", data),
};

// ─── Articles ────────────────────────────────────────────────────────────────
export const articlesAPI = {
  getAll: (params) => axiosInstance.get("/articles", { params }),
  getById: (id) => axiosInstance.get(`/articles/${id}`),
  create: (data) => axiosInstance.post("/articles", data),
  update: (id, data) => axiosInstance.put(`/articles/${id}`, data),
  delete: (id) => axiosInstance.delete(`/articles/${id}`),
};

// ─── Markets ─────────────────────────────────────────────────────────────────
export const marketsAPI = {
  getAll: (params) => axiosInstance.get("/markets", { params }),
  add: (data) => axiosInstance.post("/markets", data),
};

// ─── Magazines ───────────────────────────────────────────────────────────────
export const magazinesAPI = {
  getAll: () => axiosInstance.get("/magazines"),
  create: (data) => axiosInstance.post("/magazines", data),
};

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const subscriptionsAPI = {
  create: (data) => axiosInstance.post("/subscriptions/create", data),
  getByUser: (userId) => axiosInstance.get(`/subscriptions/user/${userId}`),
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  initiate: (data) => axiosInstance.post("/payments/initiate", data),
  verify: (data) => axiosInstance.post("/payments/verify", data),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => axiosInstance.get("/admin/stats"),
  getUsers: (params) => axiosInstance.get("/admin/users", { params }),
  updateSubscription: (id, data) => axiosInstance.put(`/admin/subscriptions/${id}`, data),
};
