import { Chatwoot } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const fetchChatwoot = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/chatwoot/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createChatwoot = async (
  instanceName: string,
  token: string,
  data: Chatwoot
) => {
  const response = await ApiInstance.post(
    `/chatwoot/set/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
