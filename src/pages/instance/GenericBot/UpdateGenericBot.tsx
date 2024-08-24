/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import {
  deleteGenericBot,
  getGenericBot,
  updateGenericBot,
} from "@/services/genericBot.service";

import { GenericBot } from "@/types/evolution.types";

import { GenericBotForm, FormSchemaType } from "./GenericBotForm";

type UpdateGenericBotProps = {
  genericBotId: string;
  resetTable: () => void;
};

function UpdateGenericBot({ genericBotId, resetTable }: UpdateGenericBotProps) {
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

        if (storedToken && instance && instance.name && genericBotId) {
          const data: GenericBot = await getGenericBot(
            instance.name,
            storedToken,
            genericBotId,
          );

          setInitialData({
            enabled: data.enabled,
            description: data.description,
            apiUrl: data.apiUrl,
            apiKey: data.apiKey || "",
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
  }, [genericBotId, instance]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && genericBotId) {
        const genericBotData: GenericBot = {
          enabled: data.enabled,
          description: data.description,
          apiUrl: data.apiUrl,
          apiKey: data.apiKey,
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

        await updateGenericBot(
          instance.name,
          storedToken,
          genericBotId,
          genericBotData,
        );
        toast.success(t("genericBot.toast.success.update"));
        resetTable();
        navigate(`/manager/instance/${instance.id}/generic/${genericBotId}`);
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

      if (storedToken && instance && instance.name && genericBotId) {
        await deleteGenericBot(instance.name, storedToken, genericBotId);
        toast.success(t("genericBot.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/dify`);
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
      <GenericBotForm
        initialData={initialData}
        onSubmit={onSubmit}
        genericBotId={genericBotId}
        handleDelete={handleDelete}
        isModal={false}
        isLoading={loading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateGenericBot };
