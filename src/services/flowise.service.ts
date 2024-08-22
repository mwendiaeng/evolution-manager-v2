import { api } from "@/lib/queries/api";

import { Flowise, FlowiseSettings } from "@/types/evolution.types";

export const findFlowise = async (instanceName: string, token: string) => {
  const response = await api.get(`/flowise/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getFlowise = async (
  instanceName: string,
  token: string,
  FlowiseId: string,
) => {
  const response = await api.get(
    `/flowise/fetch/${FlowiseId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const createFlowise = async (
  instanceName: string,
  token: string,
  data: Flowise,
) => {
  const response = await api.post(`/flowise/create/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const updateFlowise = async (
  instanceName: string,
  token: string,
  FlowiseId: string,
  data: Flowise,
) => {
  const response = await api.put(
    `/flowise/update/${FlowiseId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const deleteFlowise = async (
  instanceName: string,
  token: string,
  FlowiseId: string,
) => {
  const response = await api.delete(
    `/flowise/delete/${FlowiseId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const findDefaultSettingsFlowise = async (
  instanceName: string,
  token: string,
) => {
  const response = await api.get(`/flowise/fetchSettings/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const setDefaultSettingsFlowise = async (
  instanceName: string,
  token: string,
  data: FlowiseSettings,
) => {
  const response = await api.post(`/flowise/settings/${instanceName}`, data, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const fetchSessionsFlowise = async (
  instanceName: string,
  token: string,
  FlowiseId?: string,
) => {
  const response = await api.get(
    `/flowise/fetchSessions/${FlowiseId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    },
  );
  return response.data;
};

export const changeStatusFlowise = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string,
) => {
  const response = await api.post(
    `/flowise/changeStatus/${instanceName}`,
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
