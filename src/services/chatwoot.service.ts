import { api } from "@/lib/queries/api";

import { Chatwoot } from "@/types/evolution.types";

export const fetchChatwoot = async (instanceName: string, token: string) => {
  const response = await api.get(`/chatwoot/find/${instanceName}`, {
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
  const response = await api.post(`/chatwoot/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
