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
  create: (data) => axiosInstance.post("/markets", data),
  update: (id, data) => axiosInstance.put(`/markets/${id}`, data),
  delete: (id) => axiosInstance.delete(`/markets/${id}`),
};

// ─── Videos ──────────────────────────────────────────────────────────────────
export const videosAPI = {
  getAll: () => axiosInstance.get("/videos"),
  create: (data) => axiosInstance.post("/videos", data),
  delete: (id) => axiosInstance.delete(`/videos/${id}`),
};

// ─── Magazines ───────────────────────────────────────────────────────────────
export const magazinesAPI = {
  getAll: () => axiosInstance.get("/magazines"),
  create: (data) => axiosInstance.post("/magazines", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id) => axiosInstance.delete(`/magazines/${id}`),
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
  getEnquiries: (params) => axiosInstance.get("/admin/enquiries", { params }),
  updateSubscription: (id, data) => axiosInstance.put(`/admin/subscriptions/${id}`, data),
  deleteEnquiry: (id) => axiosInstance.delete(`/admin/enquiries/${id}`),
  updateEnquiryStatus: (id, status) => axiosInstance.patch(`/admin/enquiries/${id}/status`, { status }),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data) => axiosInstance.post("/contact/send", data),
};

