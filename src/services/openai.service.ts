import { OpenaiBot, OpenaiCreds } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const findOpenaiCreds = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/openai/creds/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createOpenaiCreds = async (
  instanceName: string,
  token: string,
  data: OpenaiCreds
) => {
  const response = await ApiInstance.post(
    `/openai/creds/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const deleteOpenaiCreds = async (
  openaiCredsId: string,
  instanceName: string
) => {
  const response = await ApiInstance.delete(
    `/openai/creds/${openaiCredsId}/${instanceName}`
  );
  return response.data;
};

export const findOpenai = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/openai/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string
) => {
  const response = await ApiInstance.get(
    `/openai/fetch/${openaiBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const createOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiBot
) => {
  const response = await ApiInstance.post(
    `/openai/create/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const updateOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string,
  data: OpenaiBot
) => {
  const response = await ApiInstance.put(
    `/openai/update/${openaiBotId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const deleteOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string
) => {
  const response = await ApiInstance.delete(
    `/openai/delete/${openaiBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
