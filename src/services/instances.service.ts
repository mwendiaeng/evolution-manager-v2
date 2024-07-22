import { NewInstance, Settings } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const createInstance = async (instance: NewInstance) => {
  const response = await ApiInstance.post("/instance/create", instance);
  return response.data;
};

export const fetchInstances = async () => {
  const response = await ApiInstance.get("/instance/fetchInstances");
  return response.data;
};

export const fetchInstance = async (instanceId: string) => {
  const response = await ApiInstance.get(
    `/instance/fetchInstances?instanceId=${instanceId}`
  );
  return response.data;
};

export const restart = async () => {
  const response = await ApiInstance.delete("/instance/restart");
  return response.data;
};

export const logout = async (instanceName: string) => {
  const response = await ApiInstance.delete(`/instance/logout/${instanceName}`);
  return response.data;
};

export const deleteInstance = async (instanceName: string) => {
  const response = await ApiInstance.delete(`/instance/delete/${instanceName}`);
  return response.data;
};

export const connect = async (
  instanceName: string,
  token: string,
  number?: string
) => {
  let url = `/instance/connect/${instanceName}`;
  if (number) url += `?number=${number}`;

  const response = await ApiInstance.get(url, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const checkStatus = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(
    `/instance/connectionState/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const settingsfind = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/settings/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const updateSettings = async (
  instanceName: string,
  token: string,
  settings: Settings
) => {
  const response = await ApiInstance.post(
    `/settings/set/${instanceName}`,
    settings,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
