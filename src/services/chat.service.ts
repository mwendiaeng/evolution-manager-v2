import { api } from "@/lib/queries/api";

export const findChats = async (instanceName: string) => {
  const response = await api.post(`/chat/findChats/${instanceName}`, {
    where: {},
  });
  return response.data;
};

export const findChat = async (instanceName: string, remoteJid: string) => {
  const response = await api.post(
    `/chat/findChats/${instanceName}`,
    {
      where: {
        remoteJid,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const findMessages = async (instanceName: string, remoteJid: string) => {
  const response = await api.post(`/chat/findMessages/${instanceName}`, {
    where: {
      key: {
        remoteJid,
      },
    },
  });
  return response.data;
};
