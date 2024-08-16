import axios, { AxiosInstance } from "axios";

class ApiService {
  private apiInstance: AxiosInstance;

  constructor() {
    this.apiInstance = axios.create({
      timeout: 10000,
    });

    this.apiInstance.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.apikey = `${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  public getInstance() {
    const apiUrl = localStorage.getItem("apiUrl");
    if (apiUrl) {
      this.apiInstance.defaults.baseURL = apiUrl.toString();
    }
    return this.apiInstance;
  }
}

export default ApiService;
