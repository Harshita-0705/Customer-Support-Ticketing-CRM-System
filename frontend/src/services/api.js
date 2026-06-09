import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Response interceptor: normalise errors ─────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Ticket endpoints ───────────────────────────────────────────────────────
export const ticketApi = {
  /** GET /tickets — list with optional filter/search/pagination */
  list: (params = {}) => api.get("/tickets", { params }),

  /** GET /tickets/stats — counts by status */
  stats: () => api.get("/tickets/stats"),

  /** GET /tickets/:ticketId — full detail + notes */
  get: (ticketId) => api.get(`/tickets/${ticketId}`),

  /** POST /tickets */
  create: (body) => api.post("/tickets", body),

  /** PUT /tickets/:ticketId */
  update: (ticketId, body) => api.put(`/tickets/${ticketId}`, body),

  /** DELETE /tickets/:ticketId/notes/:noteId */
  deleteNote: (ticketId, noteId) => api.delete(`/tickets/${ticketId}/notes/${noteId}`),

  /** DELETE /tickets/:ticketId */
  delete: (ticketId) => api.delete(`/tickets/${ticketId}`),
};

export default api;
