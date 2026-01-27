/* eslint-disable no-unused-vars */
export enum TOKEN_ID {
  API_URL = "apiUrl",
  TOKEN = "token",
  INSTANCE_ID = "instanceId",
  INSTANCE_NAME = "instanceName",
  INSTANCE_TOKEN = "instanceToken",
  VERSION = "version",
  FACEBOOK_APP_ID = "facebookAppId",
  FACEBOOK_CONFIG_ID = "facebookConfigId",
  FACEBOOK_USER_TOKEN = "facebookUserToken",
  CLIENT_NAME = "clientName",
}

const storage = typeof window !== "undefined" ? window.sessionStorage : null;

interface SaveCredentialsParams {
  url?: string;
  token?: string;
  version?: string;
  facebookAppId?: string;
  facebookConfigId?: string;
  facebookUserToken?: string;
  clientName?: string;
  instanceId?: string;
  instanceName?: string;
  instanceToken?: string;
}

export const saveToken = async (params: SaveCredentialsParams) => {
  if (!storage) return;

  if (params.url) {
    const urlFormatted = params.url.endsWith("/") ? params.url.slice(0, -1) : params.url;
    storage.setItem(TOKEN_ID.API_URL, urlFormatted);
  }

  if (params.token) storage.setItem(TOKEN_ID.TOKEN, params.token);
  if (params.version) storage.setItem(TOKEN_ID.VERSION, params.version);
  if (params.facebookAppId) storage.setItem(TOKEN_ID.FACEBOOK_APP_ID, params.facebookAppId);
  if (params.facebookConfigId) storage.setItem(TOKEN_ID.FACEBOOK_CONFIG_ID, params.facebookConfigId);
  if (params.facebookUserToken) storage.setItem(TOKEN_ID.FACEBOOK_USER_TOKEN, params.facebookUserToken);
  if (params.clientName) storage.setItem(TOKEN_ID.CLIENT_NAME, params.clientName);
  if (params.instanceId) storage.setItem(TOKEN_ID.INSTANCE_ID, params.instanceId);
  if (params.instanceName) storage.setItem(TOKEN_ID.INSTANCE_NAME, params.instanceName);
  if (params.instanceToken) storage.setItem(TOKEN_ID.INSTANCE_TOKEN, params.instanceToken);
};

export const logout = () => {
  if (!storage) return;

  storage.removeItem(TOKEN_ID.API_URL);
  storage.removeItem(TOKEN_ID.TOKEN);
  storage.removeItem(TOKEN_ID.VERSION);
  storage.removeItem(TOKEN_ID.FACEBOOK_APP_ID);
  storage.removeItem(TOKEN_ID.FACEBOOK_CONFIG_ID);
  storage.removeItem(TOKEN_ID.FACEBOOK_USER_TOKEN);
  storage.removeItem(TOKEN_ID.CLIENT_NAME);
  storage.removeItem(TOKEN_ID.INSTANCE_ID);
  storage.removeItem(TOKEN_ID.INSTANCE_NAME);
  storage.removeItem(TOKEN_ID.INSTANCE_TOKEN);
};

export const getToken = (token: TOKEN_ID) => {
  return storage ? storage.getItem(token) : null;
};
