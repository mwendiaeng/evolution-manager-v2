import { DeleteMessage } from "@/types/evolution.types";

import { api } from "../api";
import { useManageMutation } from "../mutateQuery";

interface IParams {
  instanceName: string;
  token: string;
  data: DeleteMessage;
}

const deleteMessage = async ({ instanceName, token, data }: IParams) => {
  const response = await api.delete(
    `/chat/deleteMessageForEveryone/${instanceName}`,
    {
      data,
      headers: {
        apikey: token,
        "content-type": "application/json",
      },
    },
  );
  return response.data;
};

export function useDeleteMessage() {
  const sendTextMutation = useManageMutation(deleteMessage);

  return {
    deleteMessage: sendTextMutation,
  };
}
