/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import {
  deleteTypebot,
  getTypebot,
  updateTypebot,
} from "@/services/typebot.service";

import { Typebot } from "@/types/evolution.types";

import { TypebotForm, FormSchemaType } from "./TypebotForm";

type UpdateTypebotProps = {
  typebotId: string;
  resetTable: () => void;
};

function UpdateTypebot({ typebotId, resetTable }: UpdateTypebotProps) {
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
        const storedToken = getToken(TOKEN_ID.TOKEN);

        if (storedToken && instance && instance.name && typebotId) {
          const data: Typebot = await getTypebot(
            instance.name,
            storedToken,
            typebotId,
          );

          setInitialData({
            enabled: data.enabled,
            description: data.description,
            url: data.url,
            typebot: data.typebot || "",
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
  }, [typebotId, instance]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const storedToken = getToken(TOKEN_ID.TOKEN);

      if (storedToken && instance && instance.name && typebotId) {
        const typebotData: Typebot = {
          enabled: data.enabled,
          description: data.description,
          url: data.url,
          typebot: data.typebot || "",
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

        await updateTypebot(instance.name, storedToken, typebotId, typebotData);
        toast.success(t("typebot.toast.success.update"));
        resetTable();
        navigate(`/manager/instance/${instance.id}/typebot/${typebotId}`);
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
      const storedToken = getToken(TOKEN_ID.TOKEN);

      if (storedToken && instance && instance.name && typebotId) {
        await deleteTypebot(instance.name, storedToken, typebotId);
        toast.success(t("typebot.toast.success.delete"));

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
      <TypebotForm
        initialData={initialData}
        onSubmit={onSubmit}
        typebotId={typebotId}
        handleDelete={handleDelete}
        isModal={false}
        isLoading={loading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateTypebot };
