import { api } from "@/lib/queries/api";

import { Webhook } from "@/types/evolution.types";

export const fetchWebhook = async (instanceName: string, token: string) => {
  const response = await api.get(`/webhook/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createWebhook = async (
  instanceName: string,
  token: string,
  data: Webhook,
) => {
  const response = await api.post(
    `/webhook/set/${instanceName}`,
    {
      webhook: data,
    },
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};
