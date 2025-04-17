/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import { useGetTypebot } from "@/lib/queries/typebot/getTypebot";
import { useManageTypebot } from "@/lib/queries/typebot/manageTypebot";

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

  const { deleteTypebot, updateTypebot } = useManageTypebot();
  const { data: bot, isLoading } = useGetTypebot({
    instanceName: instance?.instanceName,
    typebotId,
  });
  const initialData = useMemo(
    () => ({
      enabled: !!bot?.enabled,
      url: bot?.url ?? "",
      typebot: bot?.typebot ?? "",
      expire: bot?.expire ?? 0,
      keyword_finish: bot?.keyword_finish,
      delay_message: bot?.delay_message ?? 0,
      unknown_message: bot?.unknown_message,
      listening_from_me: !!bot?.listening_from_me,
    }),
    [
      bot?.enabled,
      bot?.expire,
      bot?.keyword_finish,
      bot?.delay_message,
      bot?.unknown_message,
      bot?.listening_from_me,
      bot?.typebot,
      bot?.url,
    ],
  );

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (instance && instance.instanceName && typebotId) {
        const typebotData: Typebot = {
          enabled: data.enabled,
          url: data.url,
          typebot: data.typebot || "",
          expire: data.expire || 0,
          keyword_finish: data.keyword_finish || "",
          delay_message: data.delay_message || 1000,
          unknown_message: data.unknown_message || "",
          listening_from_me: data.listening_from_me || false,
        };

        await updateTypebot({
          instanceName: instance.instanceName,
          typebotId,
          data: typebotData,
        });
        toast.success(t("typebot.toast.success.update"));
        resetTable();
        navigate(
          `/manager/instance/${instance.instanceId}/typebot/${typebotId}`,
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
      if (instance && instance.instanceName && typebotId) {
        await deleteTypebot({ instanceName: instance.instanceName, typebotId });
        toast.success(t("typebot.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.instanceId}/typebot`);
      } else {
        console.error("instance not found");
      }
    } catch (error) {
      console.error("Erro ao excluir dify:", error);
    }
  };

  if (isLoading) {
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
        isLoading={isLoading}
        openDeletionDialog={openDeletionDialog}
        setOpenDeletionDialog={setOpenDeletionDialog}
      />
    </div>
  );
}

export { UpdateTypebot };
