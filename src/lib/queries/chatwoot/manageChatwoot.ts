import { Chatwoot } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Chatwoot;
}

export const createChatwoot = async ({
  instanceName,
  token,
  ...data
}: IParams) => {
  const response = await api.post(`/chatwoot/set/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
