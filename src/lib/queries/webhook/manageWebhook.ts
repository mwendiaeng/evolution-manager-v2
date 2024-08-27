import { Webhook } from "@/types/evolution.types";

import { api } from "../api";

interface IParams {
  instanceName: string;
  token: string;
  data: Webhook;
}

export const createWebhook = async ({
  instanceName,
  token,
  ...data
}: IParams) => {
  const response = await api.post(
    `/webhook/set/${instanceName}`,
    { webhook: data },
    { headers: { apikey: token } },
  );
  return response.data;
};
