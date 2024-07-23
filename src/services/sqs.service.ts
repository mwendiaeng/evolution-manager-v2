import { Sqs } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const fetchSqs = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/sqs/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createSqs = async (
  instanceName: string,
  token: string,
  data: Sqs
) => {
  const response = await ApiInstance.post(
    `/sqs/set/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
