import axios from "axios";

// In production this is your Render URL e.g.
// https://customer-support-ticketing-crm-system-kpb2.onrender.com
// In dev the Vite proxy handles /api → localhost:3000, so BASE_URL stays empty.
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Normalise all errors into a single Error.message
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

// ── Ticket endpoints ──────────────────────────────────────────────────────────
export const ticketApi = {
  list:       (params = {}) => api.get("/tickets", { params }),
  stats:      ()            => api.get("/tickets/stats"),
  get:        (ticketId)    => api.get(`/tickets/${ticketId}`),
  create:     (body)        => api.post("/tickets", body),
  update:     (ticketId, body) => api.put(`/tickets/${ticketId}`, body),
  delete:     (ticketId)    => api.delete(`/tickets/${ticketId}`),
  deleteNote: (ticketId, noteId) =>
    api.delete(`/tickets/${ticketId}/notes/${noteId}`),
};

export default api;
