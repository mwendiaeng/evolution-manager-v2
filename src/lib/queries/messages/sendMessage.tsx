import { SendText, SendMedia, SendAudio } from "@/types/evolution.types";

import { api } from "../api";
import { useManageMutation } from "../mutateQuery";

interface SendTextParams {
  instanceName: string;
  token: string;
  data: SendText;
}

interface SendMediaParams {
  instanceName: string;
  token: string;
  data: SendMedia;
}

interface SendAudioParams {
  instanceName: string;
  token: string;
  data: SendAudio;
}

const sendText = async ({ instanceName, token, data }: SendTextParams) => {
  const response = await api.post(`/message/sendText/${instanceName}`, data, {
    headers: {
      apikey: token,
      "content-type": "application/json",
    },
  });
  return response.data;
};

const sendMedia = async ({ instanceName, token, data }: SendMediaParams) => {
  try {
    const formData = new FormData();

    if (data.mediaMessage.media instanceof File) {
      formData.append("file", data.mediaMessage.media); // Adiciona o arquivo ao FormData
    }

    // Adiciona os outros campos ao FormData
    formData.append("number", data.number);
    formData.append("mediatype", data.mediaMessage.mediatype);
    formData.append("mimetype", data.mediaMessage.mimetype);
    if (data.mediaMessage.caption)
      formData.append("caption", data.mediaMessage.caption);
    formData.append("fileName", data.mediaMessage.fileName);
    if (data.options?.quoted) {
      formData.append("quoted", JSON.stringify(data.options.quoted));
    }

    // Faz a requisição POST para a rota com o ID da instância
    const response = await api.post(
      `/message/sendMedia/${instanceName}`,
      formData,
      {
        headers: {
          apikey: token,
          "content-type": "multipart/form-data",
        },
      },
    );

    return response.data; // Retorna a resposta se for necessário
  } catch (error) {
    console.error("Erro ao enviar mídia:", error);
    throw error; // Propaga o erro para lidar com ele em outro lugar
  }
};

const sendAudio = async ({ instanceName, token, data }: SendAudioParams) => {
  try {
    const formData = new FormData();

    if (data.audioMessage.audio instanceof File) {
      formData.append("file", data.audioMessage.audio); // Adiciona o arquivo ao FormData
    }

    // Adiciona os outros campos ao FormData
    formData.append("number", data.number);
    // Faz a requisição POST para a rota com o ID da instância

    if (data.options?.quoted) {
      formData.append("quoted", JSON.stringify(data.options.quoted));
    }

    const response = await api.post(
      `/message/sendWhatsAppAudio/${instanceName}`,
      formData,
      {
        headers: {
          apikey: token,
          "content-type": "multipart/form-data",
        },
      },
    );

    return response.data; // Retorna a resposta se for necessário
  } catch (error) {
    console.error("Erro ao enviar áudio:", error);
    throw error; // Propaga o erro para lidar com ele em outro lugar
  }
};

export function useSendMessage() {
  const sendTextMutation = useManageMutation(sendText);

  return {
    sendText: sendTextMutation,
  };
}

export function useSendMedia() {
  const sendMediaMutation = useManageMutation(sendMedia);

  return {
    sendMedia: sendMediaMutation,
  };
}

export function useSendAudio() {
  const sendAudioMutation = useManageMutation(sendAudio);

  return {
    sendAudio: sendAudioMutation,
  };
}
