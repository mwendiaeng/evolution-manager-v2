import { Websocket } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Websocket;
}

export const createWebsocket = async ({
  instanceName,
  token,
  ...data
}: IParams) => {
  const response = await api.post(
    `/websocket/set/${instanceName}`,
    { websocket: data },
    { headers: { apikey: token } },
  );
  return response.data;
};
