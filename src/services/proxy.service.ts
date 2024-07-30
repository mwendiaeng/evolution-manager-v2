import { Proxy } from "@/types/evolution.types";
import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchProxy = async (instanceName: string, token: string) => {
  const response = await apiService.getInstance().get(`/proxy/find/${instanceName}`, {
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
  const response = await apiService.getInstance().post(`/proxy/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
