import { NewInstance, Settings } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const createInstance = async (instance: NewInstance) => {
  const response = await apiService
    .getInstance()
    .post("/instance/create", instance);
  return response.data;
};

export const fetchInstances = async () => {
  const response = await apiService
    .getInstance()
    .get("/instance/fetchInstances");
  return response.data;
};

export const fetchInstance = async (
  instanceId: string,
  abortSignal?: AbortSignal,
) => {
  const response = await apiService
    .getInstance()
    .get(`/instance/fetchInstances?instanceId=${instanceId}`, {
      signal: abortSignal,
    });
  return response.data;
};

export const restart = async (instanceName: string) => {
  const response = await apiService
    .getInstance()
    .post(`/instance/restart/${instanceName}`);
  return response.data;
};

export const logout = async (instanceName: string) => {
  const response = await apiService
    .getInstance()
    .delete(`/instance/logout/${instanceName}`);
  return response.data;
};

export const deleteInstance = async (instanceName: string) => {
  const response = await apiService
    .getInstance()
    .delete(`/instance/delete/${instanceName}`);
  return response.data;
};

export const connect = async (
  instanceName: string,
  token: string,
  number?: string,
) => {
  let url = `/instance/connect/${instanceName}`;
  if (number) url += `?number=${number}`;

  const response = await apiService.getInstance().get(url, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const checkStatus = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/instance/connectionState/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const settingsfind = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/settings/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const updateSettings = async (
  instanceName: string,
  token: string,
  settings: Settings,
) => {
  const response = await apiService
    .getInstance()
    .post(`/settings/set/${instanceName}`, settings, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};
