import { Websocket } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const fetchWebsocket = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/websocket/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createWebsocket = async (
  instanceName: string,
  token: string,
  data: Websocket
) => {
  const response = await ApiInstance.post(
    `/websocket/set/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
