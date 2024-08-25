import { api } from "@/lib/queries/api";

import { Websocket } from "@/types/evolution.types";

export const fetchWebsocket = async (instanceName: string, token: string) => {
  const response = await api.get(`/websocket/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createWebsocket = async (
  instanceName: string,
  token: string,
  data: Websocket,
) => {
  const response = await api.post(
    `/websocket/set/${instanceName}`,
    {
      websocket: data,
    },
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};
