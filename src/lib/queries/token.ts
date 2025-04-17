/* eslint-disable no-unused-vars */
export enum TOKEN_ID {
  API_URL = "apiUrl",
  TOKEN = "token",
  INSTANCE_ID = "instanceId",
  INSTANCE_NAME = "instanceName",
  INSTANCE_TOKEN = "instanceToken",
}

interface SaveCredentialsParams {
  url?: string;
  token?: string;
}

export const saveToken = async (params: SaveCredentialsParams) => {
  if (params.url) {
    const urlFormatted = params.url.endsWith("/")
      ? params.url.slice(0, -1)
      : params.url;
    localStorage.setItem(TOKEN_ID.API_URL, urlFormatted);
  }

  if (params.token) localStorage.setItem(TOKEN_ID.TOKEN, params.token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_ID.API_URL);
  localStorage.removeItem(TOKEN_ID.TOKEN);
};

export const getToken = (token: TOKEN_ID) => {
  return localStorage.getItem(token);
};
