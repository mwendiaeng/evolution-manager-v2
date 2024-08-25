/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import {
  deleteEvolutionBot,
  getEvolutionBot,
  updateEvolutionBot,
} from "@/services/evolutionBot.service";

import { EvolutionBot } from "@/types/evolution.types";

import { EvolutionBotForm, FormSchemaType } from "./EvolutionBotForm";

type UpdateEvolutionBotProps = {
  evolutionBotId: string;
  resetTable: () => void;
};

function UpdateEvolutionBot({
  evolutionBotId,
  resetTable,
}: UpdateEvolutionBotProps) {
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

        if (storedToken && instance && instance.name && evolutionBotId) {
          const data: EvolutionBot = await getEvolutionBot(
            instance.name,
            storedToken,
            evolutionBotId,
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
  }, [evolutionBotId, instance]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && evolutionBotId) {
        const evolutionBotData: EvolutionBot = {
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

        await updateEvolutionBot(
          instance.name,
          storedToken,
          evolutionBotId,
          evolutionBotData,
        );
        toast.success(t("evolutionBot.toast.success.update"));
        resetTable();
        navigate(
          `/manager/instance/${instance.id}/evolutionBot/${evolutionBotId}`,
        );
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

      if (storedToken && instance && instance.name && evolutionBotId) {
        await deleteEvolutionBot(instance.name, storedToken, evolutionBotId);
        toast.success(t("evolutionBot.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/evolutionBot`);
      } else {
        console.error("instance not found");
      }
    } catch (error) {
      console.error("Erro ao excluir evolutionBot:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="m-4">
      <EvolutionBotForm
        initialData={initialData}
        onSubmit={onSubmit}
        evolutionBotId={evolutionBotId}
        handleDelete={handleDelete}
        isModal={false}
        isLoading={loading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateEvolutionBot };
