import { NewInstance, Settings } from "@/types/evolution.types";

import { api } from "../api";

export const createInstance = async (instance: NewInstance) => {
  const response = await api.post("/instance/create", instance);
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
  const response = await api.get(`/instance/connect/${instanceName}`, {
    headers: { apikey: token },
    params: { number },
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
