import ApiInstance from "@/utils/instance";

export const findChats = async (instanceName: string) => {
  const response = await ApiInstance.post(`/chat/findChats/${instanceName}`, {
    where: {},
  });
  return response.data;
};

export const findChat = async (instanceName: string, remoteJid: string) => {
  const response = await ApiInstance.post(
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
    }
  );
  return response.data;
};

export const findMessages = async (instanceName: string, remoteJid: string) => {
  const response = await ApiInstance.post(
    `/chat/findMessages/${instanceName}`,
    {
      where: {
        key: {
          remoteJid,
        },
      },
    }
  );
  return response.data;
};
