import { GenericBot, GenericBotSettings } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const findGenericBot = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/generic/find/${instanceName}`, {
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
  const response = await apiService
    .getInstance()
    .get(`/generic/fetch/${genericBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createGenericBot = async (
  instanceName: string,
  token: string,
  data: GenericBot,
) => {
  const response = await apiService
    .getInstance()
    .post(`/generic/create/${instanceName}`, data, {
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
  const response = await apiService
    .getInstance()
    .put(`/generic/update/${genericBotId}/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const deleteGenericBot = async (
  instanceName: string,
  token: string,
  genericBotId: string,
) => {
  const response = await apiService
    .getInstance()
    .delete(`/generic/delete/${genericBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const findDefaultSettingsGenericBot = async (
  instanceName: string,
  token: string,
) => {
  const response = await apiService
    .getInstance()
    .get(`/generic/fetchSettings/${instanceName}`, {
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
  const response = await apiService
    .getInstance()
    .post(`/generic/settings/${instanceName}`, data, {
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
  const response = await apiService
    .getInstance()
    .get(`/generic/fetchSessions/${genericBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const changeStatusGenericBot = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string,
) => {
  const response = await apiService.getInstance().post(
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
