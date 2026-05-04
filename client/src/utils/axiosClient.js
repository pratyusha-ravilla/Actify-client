
// //client/src/utils/axiosClient.js


import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:5002/api",
  
const axiosClient = axios.create({
  baseURL: "https://actify-server-v9zb.onrender.com/api",
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