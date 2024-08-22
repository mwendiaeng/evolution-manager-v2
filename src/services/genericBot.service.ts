import { api } from "@/lib/queries/api";

import { GenericBot, GenericBotSettings } from "@/types/evolution.types";

export const findGenericBot = async (instanceName: string, token: string) => {
  const response = await api.get(`/generic/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getGenericBot = async (
  instanceName: string,
  token: string,
  genericBotId: string,
) => {
  const response = await api.get(
    `/generic/fetch/${genericBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const createGenericBot = async (
  instanceName: string,
  token: string,
  data: GenericBot,
) => {
  const response = await api.post(`/generic/create/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const updateGenericBot = async (
  instanceName: string,
  token: string,
  genericBotId: string,
  data: GenericBot,
) => {
  const response = await api.put(
    `/generic/update/${genericBotId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const deleteGenericBot = async (
  instanceName: string,
  token: string,
  genericBotId: string,
) => {
  const response = await api.delete(
    `/generic/delete/${genericBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const findDefaultSettingsGenericBot = async (
  instanceName: string,
  token: string,
) => {
  const response = await api.get(`/generic/fetchSettings/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const setDefaultSettingsGenericBot = async (
  instanceName: string,
  token: string,
  data: GenericBotSettings,
) => {
  const response = await api.post(`/generic/settings/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const fetchSessionsGenericBot = async (
  instanceName: string,
  token: string,
  genericBotId?: string,
) => {
  const response = await api.get(
    `/generic/fetchSessions/${genericBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const changeStatusGenericBot = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string,
) => {
  const response = await api.post(
    `/generic/changeStatus/${instanceName}`,
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
