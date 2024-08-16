import { Rabbitmq } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchRabbitmq = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/rabbitmq/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createRabbitmq = async (
  instanceName: string,
  token: string,
  data: Rabbitmq,
) => {
  const response = await apiService
    .getInstance()
    .post(`/rabbitmq/set/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};
