import { Dify, DifySettings } from "@/types/evolution.types";
import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const findDify = async (instanceName: string, token: string) => {
  const response = await apiService
    .getInstance()
    .get(`/dify/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const getDify = async (
  instanceName: string,
  token: string,
  difyId: string
) => {
  const response = await apiService
    .getInstance()
    .get(`/dify/fetch/${difyId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const createDify = async (
  instanceName: string,
  token: string,
  data: Dify
) => {
  const response = await apiService
    .getInstance()
    .post(`/dify/create/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const updateDify = async (
  instanceName: string,
  token: string,
  difyId: string,
  data: Dify
) => {
  const response = await apiService
    .getInstance()
    .put(`/dify/update/${difyId}/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const deleteDify = async (
  instanceName: string,
  token: string,
  difyId: string
) => {
  const response = await apiService
    .getInstance()
    .delete(`/dify/delete/${difyId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const findDefaultSettingsDify = async (
  instanceName: string,
  token: string
) => {
  const response = await apiService
    .getInstance()
    .get(`/dify/fetchSettings/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const setDefaultSettingsDify = async (
  instanceName: string,
  token: string,
  data: DifySettings
) => {
  const response = await apiService
    .getInstance()
    .post(`/dify/settings/${instanceName}`, data, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const fetchSessionsDify = async (
  instanceName: string,
  token: string,
  difyId: string
) => {
  const response = await apiService
    .getInstance()
    .get(`/dify/fetchSessions/${difyId}/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
  return response.data;
};

export const changeStatusDify = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string
) => {
  const response = await apiService.getInstance().post(
    `/dify/changeStatus/${instanceName}`,
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
