import { Sqs } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const fetchSqs = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/sqs/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createSqs = async (
  instanceName: string,
  token: string,
  data: Sqs,
) => {
  const response = await apiService.getInstance().post(
    `/sqs/set/${instanceName}`,
    {
      sqs: data,
    },
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};
