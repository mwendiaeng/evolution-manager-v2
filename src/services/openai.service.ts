import { api } from "@/lib/queries/api";

import {
  OpenaiBot,
  OpenaiCreds,
  OpenaiSettings,
} from "@/types/evolution.types";

export const findOpenaiCreds = async (instanceName: string, token: string) => {
  const response = await api.get(`/openai/creds/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createOpenaiCreds = async (
  instanceName: string,
  token: string,
  data: OpenaiCreds,
) => {
  const response = await api.post(`/openai/creds/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const deleteOpenaiCreds = async (
  openaiCredsId: string,
  instanceName: string,
) => {
  const response = await api.delete(
    `/openai/creds/${openaiCredsId}/${instanceName}`,
  );
  return response.data;
};

export const findOpenai = async (instanceName: string, token: string) => {
  const response = await api.get(`/openai/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getOpenai = async (
  instanceName: string,
  token: string,
  botId: string,
) => {
  const response = await api.get(`/openai/fetch/${botId}/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const createOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiBot,
) => {
  const response = await api.post(`/openai/create/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const updateOpenai = async (
  instanceName: string,
  token: string,
  botId: string,
  data: OpenaiBot,
) => {
  const response = await api.put(
    `/openai/update/${botId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const deleteOpenai = async (
  instanceName: string,
  token: string,
  botId: string,
) => {
  const response = await api.delete(`/openai/delete/${botId}/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const findDefaultSettingsOpenai = async (
  instanceName: string,
  token: string,
) => {
  const response = await api.get(`/openai/fetchSettings/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const setDefaultSettingsOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiSettings,
) => {
  const response = await api.post(`/openai/settings/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const fetchSessionsOpenai = async (
  instanceName: string,
  token: string,
  botId?: string,
) => {
  const response = await api.get(
    `/openai/fetchSessions/${botId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const changeStatusOpenai = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string,
) => {
  const response = await api.post(
    `/openai/changeStatus/${instanceName}`,
    {
      remoteJid,
      status,
    },
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const getModels = async (instanceName: string, token: string) => {
  const response = await api.get(`/openai/getModels/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};
