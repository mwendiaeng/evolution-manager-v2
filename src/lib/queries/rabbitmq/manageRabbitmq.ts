import { Rabbitmq } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Rabbitmq;
}

export const createRabbitmq = async ({
  instanceName,
  token,
  ...data
}: IParams) => {
  const response = await api.post(
    `/rabbitmq/set/${instanceName}`,
    { rabbitmq: data },
    { headers: { apikey: token } },
  );
  return response.data;
};
