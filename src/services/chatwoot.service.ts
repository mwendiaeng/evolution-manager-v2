import { Chatwoot } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchChatwoot = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/chatwoot/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createChatwoot = async (
  instanceName: string,
  token: string,
  data: Chatwoot,
) => {
  const response = await apiService
    .getInstance()
    .post(`/chatwoot/set/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};
