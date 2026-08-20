import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isPublicAuthRequest = config.url?.startsWith("/auth/");
  if (token && !isPublicAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("smarthire:logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
