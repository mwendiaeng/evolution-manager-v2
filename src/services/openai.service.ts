import { OpenaiBot, OpenaiCreds } from "@/types/evolution.types";
import ApiInstance from "@/utils/instance";

export const findOpenaiCreds = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/openai/creds/${instanceName}`, {
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
  const response = await ApiInstance.post(
    `/openai/creds/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const findOpenai = async (instanceName: string, token: string) => {
  const response = await ApiInstance.get(`/openai/find/${instanceName}`, {
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
  const response = await ApiInstance.get(
    `/openai/fetch/${openaiBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const createOpenai = async (
  instanceName: string,
  token: string,
  data: OpenaiBot
) => {
  const response = await ApiInstance.post(
    `/openai/create/${instanceName}`,
    {
      enabled: data.enabled,
      openaiCredsId: data.openaiCredsId,
      botType: data.botType,
      assistantId: data.assistantId,
      model: data.model,
      systemMessages: [data.systemMessages],
      assistantMessages: [data.assistantMessages],
      userMessages: [data.userMessages],
      maxTokens: data.maxTokens,
      triggerType: data.triggerType,
      triggerOperator: data.triggerOperator,
      triggerValue: data.triggerValue,
      expire: data.expire,
      keywordFinish: data.keywordFinish,
      delayMessage: data.delayMessage,
      unknownMessage: data.unknownMessage,
      listeningFromMe: data.listeningFromMe,
      stopBotFromMe: data.stopBotFromMe,
      keepOpen: data.keepOpen,
      debounceTime: data.debounceTime,
    },
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const updateOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string,
  data: OpenaiBot
) => {
  const response = await ApiInstance.put(
    `/openai/update/${openaiBotId}/${instanceName}`,
    data,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};

export const deleteOpenai = async (
  instanceName: string,
  token: string,
  openaiBotId: string
) => {
  const response = await ApiInstance.delete(
    `/openai/delete/${openaiBotId}/${instanceName}`,
    {
      headers: {
        apikey: token,
      },
    }
  );
  return response.data;
};
