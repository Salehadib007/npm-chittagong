"use client";
import axios from "axios";
// import { getAuth, getToken } from "./auth";
// import { useAuth } from "../context/AuthContext";

const api = axios.create({
  baseURL: "https://navy-server.vercel.app/api",
  // baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth)?.token : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
