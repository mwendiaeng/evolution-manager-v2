import { Typebot } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const findTypebot = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/typebot/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string
) => {
  const response = await ApiInstance.get(
    `/typebot/fetch/${typebotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const createTypebot = async (
  instanceName: string,
  token: string,
  data: Typebot
) => {
  const response = await ApiInstance.post(
    `/typebot/create/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const updateTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string,
  data: Typebot
) => {
  const response = await ApiInstance.put(
    `/typebot/update/${typebotId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const deleteTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string
) => {
  const response = await ApiInstance.delete(
    `/typebot/delete/${typebotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
