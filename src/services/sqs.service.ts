import { api } from "@/lib/queries/api";

import { Sqs } from "@/types/evolution.types";

export const fetchSqs = async (instanceName: string, token: string) => {
  const response = await api.get(`/sqs/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createSqs = async (
  instanceName: string,
  token: string,
  data: Sqs,
) => {
  const response = await api.post(`/sqs/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
