import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Prevent infinite refresh loop
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !isRefreshing
    ) {
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const res = await axios.post(
            "http://localhost:5000/api/auth/refresh",
            { refreshToken }
          );

          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
      } catch (err) {
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
      }

      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);
