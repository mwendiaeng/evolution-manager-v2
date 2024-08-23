import { Dify, DifySettings } from "@/types/evolution.types";

import { api } from "../api";

interface CreateDifyParams {
  instanceName: string;
  token: string;
  data: Dify;
}

export const createDify = async ({
  instanceName,
  token,
  ...data
}: CreateDifyParams) => {
  const response = await api.post(`/dify/create/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface UpdateDifyParams {
  instanceName: string;
  difyId: string;
  data: Dify;
}
export const updateDify = async ({
  instanceName,
  difyId,
  ...data
}: UpdateDifyParams) => {
  const response = await api.put(
    `/dify/update/${difyId}/${instanceName}`,
    data,
  );
  return response.data;
};

interface DeleteDifyParams {
  instanceName: string;
  difyId: string;
}
export const deleteDify = async ({
  instanceName,
  difyId,
}: DeleteDifyParams) => {
  const response = await api.delete(`/dify/delete/${difyId}/${instanceName}`);
  return response.data;
};

interface SetDefaultSettingsDifyParams {
  instanceName: string;
  token: string;
  data: DifySettings;
}
export const setDefaultSettingsDify = async ({
  instanceName,
  token,
  ...data
}: SetDefaultSettingsDifyParams) => {
  const response = await api.post(`/dify/settings/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface ChangeStatusDifyParams {
  instanceName: string;
  token: string;
  remoteJid: string;
  status: string;
}
export const changeStatusDify = async ({
  instanceName,
  token,
  remoteJid,
  status,
}: ChangeStatusDifyParams) => {
  const response = await api.post(
    `/dify/changeStatus/${instanceName}`,
    { remoteJid, status },
    { headers: { apikey: token } },
  );
  return response.data;
};
