import {
  OpenaiBot,
  OpenaiCreds,
  OpenaiSettings,
} from "@/types/evolution.types";
import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const findOpenaiCreds = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/openai/creds/${instanceName}`, {
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
  const response = await apiService
    .getInstance()
    .post(`/openai/creds/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const deleteOpenaiCreds = async (
  openaiCredsId: string,
  instanceName: string
) => {
  const response = await apiService
    .getInstance()
    .delete(`/openai/creds/${openaiCredsId}/${instanceName}`);
  return response.data;
};

export const findOpenai = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/openai/find/${instanceName}`, {
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
  const response = await apiService
    .getInstance()
    .get(`/openai/fetch/${openaiBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiBot
) => {
  const response = await apiService
    .getInstance()
    .post(`/openai/create/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const updateOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string,
  data: OpenaiBot
) => {
  const response = await apiService
    .getInstance()
    .put(`/openai/update/${openaiBotId}/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const deleteOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string
) => {
  const response = await apiService
    .getInstance()
    .delete(`/openai/delete/${openaiBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const findDefaultSettingsOpenai = async (
  instanceName: string,
  token: string
) => {
  const response = await apiService
    .getInstance()
    .get(`/openai/fetchSettings/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const setDefaultSettingsOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiSettings
) => {
  const response = await apiService
    .getInstance()
    .post(`/openai/settings/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const fetchSessionsOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string
) => {
  const response = await apiService
    .getInstance()
    .get(`/openai/fetchSessions/${openaiBotId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const changeStatusOpenai = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string
) => {
  const response = await apiService.getInstance().post(
    `/openai/changeStatus/${instanceName}`,
    {
      remoteJid,
      status,
    },
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const getModels = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/openai/getModels/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};
