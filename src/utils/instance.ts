import axios from "axios";

const apiUrl = localStorage.getItem("apiUrl");
const token = localStorage.getItem("token");

const ApiInstance = axios.create({
  baseURL: apiUrl?.toString(),
  timeout: 10000,
});

ApiInstance.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers.apikey = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ApiInstance;
