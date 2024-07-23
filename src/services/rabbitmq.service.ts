import { Rabbitmq } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const fetchRabbitmq = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/rabbitmq/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createRabbitmq = async (
  instanceName: string,
  token: string,
  data: Rabbitmq
) => {
  const response = await ApiInstance.post(
    `/rabbitmq/set/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
