import { Settings } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";


export const fetchWebhook = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/webhook/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createWebhook = async (
  instanceName: string,
  token: string,
  settings: Settings
) => {
  const response = await ApiInstance.post(
    `/webhook/set/${instanceName}`,
    settings,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};