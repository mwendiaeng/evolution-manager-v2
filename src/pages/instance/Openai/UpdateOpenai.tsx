/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import {
  deleteOpenai,
  getOpenai,
  updateOpenai,
} from "@/services/openai.service";

import { Openai } from "@/types/evolution.types";

import { OpenaiForm, FormSchemaType } from "./OpenaiForm";

type UpdateOpenaiProps = {
  openaiId: string;
  resetTable: () => void;
};

function UpdateOpenai({ openaiId, resetTable }: UpdateOpenaiProps) {
  const { t } = useTranslation();
  const { instance } = useInstance();
  const navigate = useNavigate();
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<FormSchemaType | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        console.log(storedToken, instance, instance?.name, openaiId);
        if (storedToken && instance && instance.name && openaiId) {
          const data: Openai = await getOpenai(
            instance.name,
            storedToken,
            openaiId,
          );

          setInitialData({
            enabled: data.enabled,
            description: data.description,
            openaiCredsId: data.openaiCredsId,
            botType: data.botType,
            assistantId: data.assistantId || "",
            functionUrl: data.functionUrl || "",
            model: data.model || "",
            systemMessages: Array.isArray(data.systemMessages)
              ? data.systemMessages.join(", ")
              : data.systemMessages || "",
            assistantMessages: Array.isArray(data.assistantMessages)
              ? data.assistantMessages.join(", ")
              : data.assistantMessages || "",
            userMessages: Array.isArray(data.userMessages)
              ? data.userMessages.join(", ")
              : data.userMessages || "",
            maxTokens: data.maxTokens || 0,
            triggerType: data.triggerType || "",
            triggerOperator: data.triggerOperator || "",
            triggerValue: data.triggerValue,
            expire: data.expire || 0,
            keywordFinish: data.keywordFinish,
            delayMessage: data.delayMessage || 0,
            unknownMessage: data.unknownMessage,
            listeningFromMe: data.listeningFromMe,
            stopBotFromMe: data.stopBotFromMe,
            keepOpen: data.keepOpen,
            debounceTime: data.debounceTime || 0,
          });
        } else {
          console.error("Token not found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [openaiId, instance]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && openaiId) {
        const openaiData: Openai = {
          enabled: data.enabled,
          description: data.description,
          openaiCredsId: data.openaiCredsId,
          botType: data.botType,
          assistantId: data.assistantId || "",
          functionUrl: data.functionUrl || "",
          model: data.model || "",
          systemMessages: [data.systemMessages || ""],
          assistantMessages: [data.assistantMessages || ""],
          userMessages: [data.userMessages || ""],
          maxTokens: data.maxTokens || 0,
          triggerType: data.triggerType,
          triggerOperator: data.triggerOperator || "",
          triggerValue: data.triggerValue || "",
          expire: data.expire || 0,
          keywordFinish: data.keywordFinish || "",
          delayMessage: data.delayMessage || 1000,
          unknownMessage: data.unknownMessage || "",
          listeningFromMe: data.listeningFromMe || false,
          stopBotFromMe: data.stopBotFromMe || false,
          keepOpen: data.keepOpen || false,
          debounceTime: data.debounceTime || 0,
        };

        await updateOpenai(instance.name, storedToken, openaiId, openaiData);
        toast.success(t("openai.toast.success.update"));
        resetTable();
        navigate(`/manager/instance/${instance.id}/openai/${openaiId}`);
      } else {
        console.error("Token not found");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && openaiId) {
        await deleteOpenai(instance.name, storedToken, openaiId);
        toast.success(t("openai.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/openai`);
      } else {
        console.error("instance not found");
      }
    } catch (error) {
      console.error("Erro ao excluir dify:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="m-4">
      <OpenaiForm
        initialData={initialData}
        onSubmit={onSubmit}
        openaiId={openaiId}
        handleDelete={handleDelete}
        isModal={false}
        isLoading={loading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateOpenai };
