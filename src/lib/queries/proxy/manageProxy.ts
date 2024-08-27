import { Proxy } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Proxy;
}

export const createProxy = async ({
  instanceName,
  token,
  ...data
}: IParams) => {
  const response = await api.post(`/proxy/set/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};
