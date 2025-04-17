import { NewInstance } from "@/types/evolution.types";

import { api, apiGlobal } from "../api";
import { useManageMutation } from "../mutateQuery";

const createInstance = async (instance: NewInstance) => {
  const response = await apiGlobal.post("/instance/create", instance);
  return response.data;
};

const restart = async (token: string) => {
  const response = await api.post(`/instance/reconnect`, {
    headers: { apikey: token },
  });
  return response.data;
};

const logout = async (token: string) => {
  const response = await api.delete(`/instance/logout`, {
    headers: { apikey: token },
  });
  return response.data;
};

const deleteInstance = async (instanceId: string) => {
  const response = await apiGlobal.delete(`/instance/delete/${instanceId}`);
  return response.data;
};

interface ConnectParams {
  token: string;
  webhookUrl: string;
  subscribe: string[];
  rabbitmqEnable?: string;
  websocketEnable?: string;
}

interface PairingCodeParams {
  token: string;
  number: string;
}

const connect = async ({
  token,
  subscribe,
  webhookUrl,
  rabbitmqEnable = "disabled",
  websocketEnable = "disabled",
}: ConnectParams) => {
  const response = await api.post(
    `/instance/connect`,
    {
      subscribe,
      webhookUrl,
      rabbitmqEnable,
      websocketEnable,
    },
    {
      headers: { apikey: token },
    },
  );
  return response.data;
};

const pairingCode = async ({ token, number }: PairingCodeParams) => {
  const response = await api.post(
    `/instance/pair`,
    { phone: number },
    {
      headers: { apikey: token },
    },
  );
  return response.data;
};

const getStatus = async (token: string) => {
  const response = await api.get(`/instance/status`, {
    headers: { apikey: token },
  });
  return response.data;
};

const getQrcode = async (token: string) => {
  const response = await api.get(`/instance/qr`, {
    headers: { apikey: token },
  });
  return response.data;
};

export function useManageInstance() {
  const connectMutation = useManageMutation(connect, {
    invalidateKeys: [
      ["instance", "fetchInstance"],
      ["instance", "fetchInstances"],
    ],
  });

  const pairingCodeMutation = useManageMutation(pairingCode, {
    invalidateKeys: [["instance", "fetchInstance"]],
  });

  const deleteInstanceMutation = useManageMutation(deleteInstance, {
    invalidateKeys: [
      ["instance", "fetchInstance"],
      ["instance", "fetchInstances"],
    ],
  });
  const logoutMutation = useManageMutation(logout, {
    invalidateKeys: [
      ["instance", "fetchInstance"],
      ["instance", "fetchInstances"],
    ],
  });
  const restartMutation = useManageMutation(restart, {
    invalidateKeys: [
      ["instance", "fetchInstance"],
      ["instance", "fetchInstances"],
    ],
  });
  const createInstanceMutation = useManageMutation(createInstance, {
    invalidateKeys: [["instance", "fetchInstances"]],
  });

  const getStatusMutation = useManageMutation(getStatus, {
    invalidateKeys: [["instance", "fetchInstance"]],
  });

  const getQrcodeMutation = useManageMutation(getQrcode, {
    invalidateKeys: [["instance", "fetchInstance"]],
  });

  return {
    connect: connectMutation,
    deleteInstance: deleteInstanceMutation,
    logout: logoutMutation,
    restart: restartMutation,
    createInstance: createInstanceMutation,
    getStatus: getStatusMutation,
    getQrcode: getQrcodeMutation,
    pair: pairingCodeMutation,
  };
}
