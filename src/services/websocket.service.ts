import { Websocket } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchWebsocket = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/websocket/find/${instanceName}`, {
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
  const response = await apiService.getInstance().post(
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
