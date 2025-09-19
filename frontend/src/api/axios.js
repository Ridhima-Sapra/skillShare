// frontend/src/api/axios.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const instance = axios.create({
  baseURL: API_BASE,
});

// Attach JWT (if present) to all requests made with this instance
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with safer refresh logic
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No original request = =can't retry
    if (!originalRequest) return Promise.reject(error);

    // Build full URL of the original request for robust checks
    const fullUrl = originalRequest.url?.startsWith("http")
      ? originalRequest.url
      : `${originalRequest.baseURL || API_BASE}${originalRequest.url}`;

    // Avoid infinite loop: if the failed request is the refresh endpoint, don't try to refresh again.
    if (fullUrl.includes("/token/refresh/")) return Promise.reject(error);

    // Only attempt JWT refresh for requests that target your backend API (not external APIs like Google).
    const isOurApi = fullUrl.startsWith(API_BASE);

    // Only refresh once per request (mark with _retry)
    if (isOurApi && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Use global axios (not instance) to avoid this interceptor being applied to the refresh call.
        const res = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
        localStorage.setItem("token", res.data.access);

        // update header and retry original request once
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        return instance(originalRequest);
      } catch (err) {
        // Refresh failed — logout
        console.error("Refresh failed, logging out.", err);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // For all other cases (external APIs like Google, or already retried) -> propagate error
    return Promise.reject(error);
  }
);

export default instance;
