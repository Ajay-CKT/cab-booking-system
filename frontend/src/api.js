import axios from "axios";

const api = axios.create({
  baseURL: "", // provide yoour base url for the access from the backend
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
