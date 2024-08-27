import { Openai, OpenaiCreds, OpenaiSettings } from "@/types/evolution.types";

import { api } from "../api";

interface CreateOpenaiCredsParams {
  instanceName: string;
  token?: string;
  data: OpenaiCreds;
}
export const createOpenaiCreds = async ({
  instanceName,
  token,
  data,
}: CreateOpenaiCredsParams) => {
  const response = await api.post(`/openai/creds/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface DeleteOpenaiCredsParams {
  openaiCredsId: string;
  instanceName: string;
}
export const deleteOpenaiCreds = async ({
  openaiCredsId,
  instanceName,
}: DeleteOpenaiCredsParams) => {
  const response = await api.delete(
    `/openai/creds/${openaiCredsId}/${instanceName}`,
  );
  return response.data;
};

interface CreateOpenaiParams {
  instanceName: string;
  token?: string;
  data: Openai;
}
export const createOpenai = async ({
  instanceName,
  token,
  data,
}: CreateOpenaiParams) => {
  const response = await api.post(`/openai/create/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface UpdateOpenaiParams {
  instanceName: string;
  token?: string;
  openaiId: string;
  data: Openai;
}
export const updateOpenai = async ({
  instanceName,
  token,
  openaiId,
  data,
}: UpdateOpenaiParams) => {
  const response = await api.put(
    `/openai/update/${openaiId}/${instanceName}`,
    data,
    { headers: { apikey: token } },
  );
  return response.data;
};

interface DeleteOpenaiParams {
  instanceName: string;
  token?: string;
  openaiId: string;
}
export const deleteOpenai = async ({
  instanceName,
  token,
  openaiId,
}: DeleteOpenaiParams) => {
  const response = await api.delete(
    `/openai/delete/${openaiId}/${instanceName}`,
    { headers: { apikey: token } },
  );
  return response.data;
};

interface SetDefaultSettingsOpenaiParams {
  instanceName: string;
  token?: string;
  data: OpenaiSettings;
}
export const setDefaultSettingsOpenai = async ({
  instanceName,
  token,
  data,
}: SetDefaultSettingsOpenaiParams) => {
  const response = await api.post(`/openai/settings/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface ChangeStatusOpenaiParams {
  instanceName: string;
  token?: string;
  remoteJid: string;
  status: string;
}
export const changeStatusOpenai = async ({
  instanceName,
  token,
  remoteJid,
  status,
}: ChangeStatusOpenaiParams) => {
  const response = await api.post(
    `/openai/changeStatus/${instanceName}`,
    { remoteJid, status },
    { headers: { apikey: token } },
  );
  return response.data;
};
