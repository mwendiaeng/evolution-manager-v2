import { Typebot, TypebotSettings } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const findTypebot = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/typebot/find/${instanceName}`, {
    headers: {
      apikey: token,
    },
  });
  return response.data;
};

export const getTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string
) => {
  const response = await ApiInstance.get(
    `/typebot/fetch/${typebotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const createTypebot = async (
  instanceName: string,
  token: string,
  data: Typebot
) => {
  const response = await ApiInstance.post(
    `/typebot/create/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const updateTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string,
  data: Typebot
) => {
  const response = await ApiInstance.put(
    `/typebot/update/${typebotId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const deleteTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string
) => {
  const response = await ApiInstance.delete(
    `/typebot/delete/${typebotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const findDefaultSettingsTypebot = async (
  instanceName: string,
  token: string
) => {
  const response = await ApiInstance.get(
    `/typebot/fetchSettings/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const setDefaultSettingsTypebot = async (
  instanceName: string,
  token: string,
  data: TypebotSettings
) => {
  const response = await ApiInstance.post(
    `/typebot/settings/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const fetchSessionsTypebot = async (
  instanceName: string,
  token: string,
  typebotId: string
) => {
  const response = await ApiInstance.get(
    `/typebot/fetchSessions/${typebotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const changeStatusTypebot = async (
  instanceName: string,
  token: string,
  remoteJid: string,
  status: string
) => {
  const response = await ApiInstance.post(
    `/typebot/changeStatus/${instanceName}`,
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
