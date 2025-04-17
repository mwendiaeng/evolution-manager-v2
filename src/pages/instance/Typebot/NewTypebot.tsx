/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusIcon } from "lucide-react"; // Importando o ícone corretamente
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useInstance } from "@/contexts/InstanceContext";

import { useManageTypebot } from "@/lib/queries/typebot/manageTypebot";

import { Typebot } from "@/types/evolution.types";

import { FormSchemaType, TypebotForm } from "./TypebotForm";

function NewTypebot({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const { createTypebot } = useManageTypebot();
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (!instance || !instance.instanceName) {
        throw new Error("instance not found");
      }

      setUpdating(true);
      const typebotData: Typebot = {
        enabled: data.enabled,
        url: data.url,
        typebot: data.typebot || "",
        expire: data.expire || 0,
        keyword_finish: data.keyword_finish || "",
        delay_message: data.delay_message || 0,
        unknown_message: data.unknown_message || "",
        listening_from_me: data.listening_from_me || false,
      };

      await createTypebot({
        instanceName: instance.instanceName,
        token: instance.apikey,
        data: typebotData,
      });
      toast.success(t("typebot.toast.success.create"));
      setOpen(false);
      resetTable();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">{t("typebot.button.create")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]">
        <DialogHeader>
          <DialogTitle>{t("typebot.form.title")}</DialogTitle>
        </DialogHeader>
        <TypebotForm onSubmit={onSubmit} isModal={true} isLoading={updating} />
      </DialogContent>
    </Dialog>
  );
}

export { NewTypebot };
