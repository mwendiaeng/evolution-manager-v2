import { Webhook } from "@/types/evolution.types";
import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchWebhook = async (instanceName: string, token: string) => {
  const response = await apiService.getInstance().get(`/webhook/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createWebhook = async (
  instanceName: string,
  token: string,
  data: Webhook
) => {
  const response = await apiService.getInstance().post(
    `/webhook/set/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
