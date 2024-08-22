import { api } from "@/lib/queries/api";

import { NewInstance, Settings } from "@/types/evolution.types";

export const createInstance = async (instance: NewInstance) => {
  const response = await api.post("/instance/create", instance);
  return response.data;
};

export const fetchInstances = async () => {
  const response = await api.get("/instance/fetchInstances");
  return response.data;
};

export const fetchInstance = async (
  instanceId: string,
  abortSignal?: AbortSignal,
) => {
  const response = await api.get(
    `/instance/fetchInstances?instanceId=${instanceId}`,
    {
      signal: abortSignal,
    },
  );
  return response.data;
};

export const restart = async (instanceName: string) => {
  const response = await api.post(`/instance/restart/${instanceName}`);
  return response.data;
};

export const logout = async (instanceName: string) => {
  const response = await api.delete(`/instance/logout/${instanceName}`);
  return response.data;
};

export const deleteInstance = async (instanceName: string) => {
  const response = await api.delete(`/instance/delete/${instanceName}`);
  return response.data;
};

export const connect = async (
  instanceName: string,
  token: string,
  number?: string,
) => {
  let url = `/instance/connect/${instanceName}`;
  if (number) url += `?number=${number}`;

  const response = await api.get(url, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const checkStatus = async (instanceName: string, token: string) => {
  const response = await api.get(`/instance/connectionState/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const settingsfind = async (instanceName: string, token: string) => {
  const response = await api.get(`/settings/find/${instanceName}`, {
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
  const response = await api.post(`/settings/set/${instanceName}`, settings, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
