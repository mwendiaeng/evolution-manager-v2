import { Sqs } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Sqs;
}

export const createSqs = async ({ instanceName, token, ...data }: IParams) => {
  const response = await api.post(
    `/sqs/set/${instanceName}`,
    { sqs: data },
    { headers: { apikey: token } },
  );
  return response.data;
};
