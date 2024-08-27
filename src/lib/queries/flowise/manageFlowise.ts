import { Flowise, FlowiseSettings } from "@/types/evolution.types";

import { api } from "../api";

interface CreateFlowiseParams {
  instanceName: string;
  token: string;
  data: Flowise;
}
export const createFlowise = async ({
  instanceName,
  token,
  data,
}: CreateFlowiseParams) => {
  const response = await api.post(`/flowise/create/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};

interface UpdateFlowiseParams {
  instanceName: string;
  flowiseId: string;
  data: Flowise;
}
export const updateFlowise = async ({
  instanceName,
  flowiseId,
  data,
}: UpdateFlowiseParams) => {
  const response = await api.put(
    `/flowise/update/${flowiseId}/${instanceName}`,
    data,
  );
  return response.data;
};

interface DeleteFlowiseParams {
  instanceName: string;
  flowiseId: string;
}
export const deleteFlowise = async ({
  instanceName,
  flowiseId,
}: DeleteFlowiseParams) => {
  const response = await api.delete(
    `/flowise/delete/${flowiseId}/${instanceName}`,
  );
  return response.data;
};

interface ChangeStatusFlowiseParams {
  instanceName: string;
  token: string;
  remoteJid: string;
  status: string;
}
export const changeStatusFlowise = async ({
  instanceName,
  token,
  remoteJid,
  status,
}: ChangeStatusFlowiseParams) => {
  const response = await api.post(
    `/flowise/changeStatus/${instanceName}`,
    { remoteJid, status },
    { headers: { apikey: token } },
  );
  return response.data;
};

interface SetDefaultSettingsFlowiseParams {
  instanceName: string;
  token: string;
  data: FlowiseSettings;
}
export const setDefaultSettingsFlowise = async ({
  instanceName,
  token,
  data,
}: SetDefaultSettingsFlowiseParams) => {
  const response = await api.post(`/flowise/settings/${instanceName}`, data, {
    headers: { apikey: token },
  });
  return response.data;
};
