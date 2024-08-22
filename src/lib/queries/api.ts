import axios from "axios";

import { getToken, TOKEN_ID } from "./token";

export const api = axios.create({
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const apiUrl = getToken(TOKEN_ID.API_URL);
    if (apiUrl) {
      config.baseURL = apiUrl.toString();
    }

    const token = getToken(TOKEN_ID.TOKEN);
    if (token) {
      config.headers.apikey = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
