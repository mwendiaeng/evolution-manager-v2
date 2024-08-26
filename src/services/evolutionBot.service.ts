import { EvolutionBot, EvolutionBotSettings } from "@/types/evolution.types";

import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const findEvolutionBot = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/evolutionBot/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const getEvolutionBot = async (
  instanceName: string,
  token: string,
  evolutionBotId: string,
) => {
  const response = await apiService
    .getInstance()
    .get(`/evolutionBot/fetch/${evolutionBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createEvolutionBot = async (
  instanceName: string,
  token: string,
  data: EvolutionBot,
) => {
  const response = await apiService
    .getInstance()
    .post(`/evolutionBot/create/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const updateEvolutionBot = async (
  instanceName: string,
  token: string,
  evolutionBotId: string,
  data: EvolutionBot,
) => {
  const response = await apiService
    .getInstance()
    .put(`/evolutionBot/update/${evolutionBotId}/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const deleteEvolutionBot = async (
  instanceName: string,
  token: string,
  evolutionBotId: string,
) => {
  const response = await apiService
    .getInstance()
    .delete(`/evolutionBot/delete/${evolutionBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const findDefaultSettingsEvolutionBot = async (
  instanceName: string,
  token: string,
) => {
  const response = await apiService
    .getInstance()
    .get(`/evolutionBot/fetchSettings/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const setDefaultSettingsEvolutionBot = async (
  instanceName: string,
  token: string,
  data: EvolutionBotSettings,
) => {
  const response = await apiService
    .getInstance()
    .post(`/evolutionBot/settings/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const fetchSessionsEvolutionBot = async (
  instanceName: string,
  token: string,
  evolutionBotId?: string,
) => {
  const response = await apiService
    .getInstance()
    .get(`/evolutionBot/fetchSessions/${evolutionBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const changeStatusEvolutionBot = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string,
) => {
  const response = await apiService.getInstance().post(
    `/evolutionBot/changeStatus/${instanceName}`,
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
