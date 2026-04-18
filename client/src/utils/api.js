import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "https://shopsphere-mern-stock-e-commerce.onrender.com/api",
  withCredentials: true,
});

// --- Safe localStorage getter ---
const getSafeItem = (key) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") return null;
  return value;
};

// --- Detect active token type ---
const getActiveTokenType = () => {
  if (localStorage.getItem("adminToken")) return "admin";
  if (localStorage.getItem("userToken")) return "user";
  return null;
};

// --- Request Interceptor ---
api.interceptors.request.use((config) => {
  const adminToken = getSafeItem("adminToken");
  const userToken = getSafeItem("userToken");

  // ✅ Decide which token to send
  if (config.url.includes("/admin")) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      // fallback if only admin logged in
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  console.log("🚀 TOKEN SENT:", config.headers.Authorization);

  return config;
});

// --- Response Interceptor ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "https://shopsphere-mern-stock-e-commerce.onrender.com/api/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;

        // ✅ Update correct token
        const type = getActiveTokenType();

        if (type === "admin") {
          localStorage.setItem("adminToken", accessToken);
        } else if (type === "user") {
          localStorage.setItem("userToken", accessToken);
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);

        // ❌ clear everything on failure
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");

        window.dispatchEvent(new Event("storage"));

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);