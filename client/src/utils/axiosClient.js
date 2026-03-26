
// //client/src/utils/axiosClient.js


import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5002/api",
  
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const user = localStorage.getItem("actirepo_user");

  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;