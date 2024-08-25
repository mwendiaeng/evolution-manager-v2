import { api } from "@/lib/queries/api";

import { Rabbitmq } from "@/types/evolution.types";

export const fetchRabbitmq = async (instanceName: string, token: string) => {
  const response = await api.get(`/rabbitmq/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createRabbitmq = async (
  instanceName: string,
  token: string,
  data: Rabbitmq,
) => {
  const response = await api.post(
    `/rabbitmq/set/${instanceName}`,
    {
      rabbitmq: data,
    },
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};
