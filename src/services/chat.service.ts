import ApiService from "@/utils/instance";

const apiService = new ApiService();

export const findChats = async (instanceName: string) => {
  const response = await apiService
    .getInstance()
    .post(`/chat/findChats/${instanceName}`, {
      where: {},
    });
  return response.data;
};

export const findChat = async (instanceName: string, remoteJid: string) => {
  const response = await apiService.getInstance().post(
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
  const response = await apiService
    .getInstance()
    .post(`/chat/findMessages/${instanceName}`, {
      where: {
        key: {
          remoteJid,
        },
      },
    });
  return response.data;
};
