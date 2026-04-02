// lib/axiosInstance.js
import axios from "axios";
import store from "@/store"; // make sure this points to your actual Redux store

const baseInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

baseInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const role = localStorage.getItem("role");
      const email = localStorage.getItem("email");

      if (role === "admin" && email) {
        const params = new URLSearchParams(config.params || {});
        params.set("selectedUser", email);
        config.params = params;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default baseInstance;
