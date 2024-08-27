import { EvolutionBot, EvolutionBotSettings } from "@/types/evolution.types";

import { api } from "../api";

interface CreateEvolutionBotParams {
  instanceName: string;
  token?: string;
  data: EvolutionBot;
}

export const createEvolutionBot = async ({
  instanceName,
  token,
  data,
}: CreateEvolutionBotParams) => {
  const response = await api.post(
    `/evolutionBot/create/${instanceName}`,
    data,
    { headers: { apikey: token } },
  );
  return response.data;
};

interface UpdateEvolutionBotParams extends CreateEvolutionBotParams {
  evolutionBotId: string;
}

export const updateEvolutionBot = async ({
  instanceName,
  token,
  evolutionBotId,
  data,
}: UpdateEvolutionBotParams) => {
  const response = await api.put(
    `/evolutionBot/update/${evolutionBotId}/${instanceName}`,
    data,
    { headers: { apikey: token } },
  );
  return response.data;
};

interface DeleteEvolutionBotParams {
  instanceName: string;
  evolutionBotId: string;
}
export const deleteEvolutionBot = async ({
  instanceName,
  evolutionBotId,
}: DeleteEvolutionBotParams) => {
  const response = await api.delete(
    `/evolutionBot/delete/${evolutionBotId}/${instanceName}`,
  );
  return response.data;
};

interface SetDefaultSettingsEvolutionBotParams {
  instanceName: string;
  token: string;
  data: EvolutionBotSettings;
}
export const setDefaultSettingsEvolutionBot = async ({
  instanceName,
  token,
  data,
}: SetDefaultSettingsEvolutionBotParams) => {
  const response = await api.post(
    `/evolutionBot/settings/${instanceName}`,
    data,
    { headers: { apikey: token } },
  );
  return response.data;
};

interface ChangeStatusEvolutionBotParams {
  instanceName: string;
  token: string;
  remoteJid: string;
  status: string;
}
export const changeStatusEvolutionBot = async ({
  instanceName,
  token,
  remoteJid,
  status,
}: ChangeStatusEvolutionBotParams) => {
  const response = await api.post(
    `/evolutionBot/changeStatus/${instanceName}`,
    {
      remoteJid,
      status,
    },
    { headers: { apikey: token } },
  );
  return response.data;
};
