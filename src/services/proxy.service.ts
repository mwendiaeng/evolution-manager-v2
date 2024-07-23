import { Proxy } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const fetchProxy = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/proxy/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createProxy = async (
  instanceName: string,
  token: string,
  data: Proxy
) => {
  const response = await ApiInstance.post(`/proxy/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
