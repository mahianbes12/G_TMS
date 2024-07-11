import axios from "axios";
import { backendUrl } from "./index.js";

const instance = axios.create({
  // baseURL: backendUrl,
  baseURL: "http://localhost:3000/gizemysql://root:12345678@localhost:3306/gize",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  //Error
  (err) => {
    return err.message;
  }
);

export default instance;
