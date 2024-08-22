import { api } from "@/lib/queries/api";

import { Proxy } from "@/types/evolution.types";

export const fetchProxy = async (instanceName: string, token: string) => {
  const response = await api.get(`/proxy/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createProxy = async (
  instanceName: string,
  token: string,
  data: Proxy,
) => {
  const response = await api.post(`/proxy/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
