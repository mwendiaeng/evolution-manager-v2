/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import {
  deleteFlowise,
  getFlowise,
  updateFlowise,
} from "@/services/flowise.service";

import { Flowise } from "@/types/evolution.types";

import { FlowiseForm, FormSchemaType } from "./FlowiseForm";

type UpdateFlowiseProps = {
  flowiseId: string;
  resetTable: () => void;
};

function UpdateFlowise({ flowiseId, resetTable }: UpdateFlowiseProps) {
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

        if (storedToken && instance && instance.name && flowiseId) {
          const data: Flowise = await getFlowise(
            instance.name,
            storedToken,
            flowiseId,
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
  }, [flowiseId, instance]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && flowiseId) {
        const flowiseData: Flowise = {
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

        await updateFlowise(instance.name, storedToken, flowiseId, flowiseData);
        toast.success(t("flowise.toast.success.update"));
        resetTable();
        navigate(`/manager/instance/${instance.id}/flowise/${flowiseId}`);
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

      if (storedToken && instance && instance.name && flowiseId) {
        await deleteFlowise(instance.name, storedToken, flowiseId);
        toast.success(t("flowise.toast.success.delete"));

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
      <FlowiseForm
        initialData={initialData}
        onSubmit={onSubmit}
        flowiseId={flowiseId}
        handleDelete={handleDelete}
        isModal={false}
        isLoading={loading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateFlowise };
