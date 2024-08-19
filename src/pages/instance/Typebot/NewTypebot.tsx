import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput, FormSelect, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useInstance } from "@/contexts/InstanceContext";

import { createTypebot } from "@/services/typebot.service";

import { Typebot } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  url: z.string().url(),
  typebot: z.string(),
  triggerType: z.string(),
  triggerOperator: z.string().optional(),
  triggerValue: z.string().optional(),
  expire: z.string(),
  keywordFinish: z.string(),
  delayMessage: z.string(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.string(),
  ignoreJids: z.array(z.string()).default([]),
});

function NewTypebot({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      url: "",
      typebot: "",
      triggerType: "keyword",
      triggerOperator: "contains",
      triggerValue: "",
      expire: "0",
      keywordFinish: "",
      delayMessage: "0",
      unknownMessage: "",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: "0",
      ignoreJids: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      setUpdating(true);
      const typebotData: Typebot = {
        enabled: data.enabled,
        description: data.description,
        url: data.url,
        typebot: data.typebot,
        triggerType: data.triggerType,
        triggerOperator: data.triggerOperator || "",
        triggerValue: data.triggerValue || "",
        expire: parseInt(data.expire, 10),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage, 10),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime, 10),
      };

      await createTypebot(instance.name, instance.token, typebotData);
      toast.success(t("typebot.toast.success.create"));
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(t("typebot.toast.error"), error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    } finally {
      setUpdating(false);
    }
  };

  function onReset() {
    form.reset();
  }

  const triggerType = form.watch("triggerType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5 text-white">
          <PlusIcon />
          <span className="hidden sm:inline">{t("typebot.button.create")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("typebot.form.title")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="space-y-4">
                <FormSwitch
                  name="enabled"
                  label={t("typebot.form.enabled.label")}
                  reverse
                />
                <FormInput
                  name="description"
                  label={t("typebot.form.description.label")}
                  required
                >
                  <Input />
                </FormInput>
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("typebot.form.typebotSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormInput
                  name="url"
                  label={t("typebot.form.url.label")}
                  required
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="typebot"
                  label={t("typebot.form.typebot.label")}
                  required
                >
                  <Input />
                </FormInput>
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("typebot.form.triggerSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label={t("typebot.form.triggerType.label")}
                  required
                  options={[
                    {
                      label: t("typebot.form.triggerType.keyword"),
                      value: "keyword",
                    },
                    { label: t("typebot.form.triggerType.all"), value: "all" },
                    {
                      label: t("typebot.form.triggerType.advanced"),
                      value: "advanced",
                    },
                    {
                      label: t("typebot.form.triggerType.none"),
                      value: "none",
                    },
                  ]}
                />
                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label={t("typebot.form.triggerOperator.label")}
                      required
                      options={[
                        {
                          label: t("typebot.form.triggerOperator.contains"),
                          value: "contains",
                        },
                        {
                          label: t("typebot.form.triggerOperator.equals"),
                          value: "equals",
                        },
                        {
                          label: t("typebot.form.triggerOperator.startsWith"),
                          value: "startsWith",
                        },
                        {
                          label: t("typebot.form.triggerOperator.endsWith"),
                          value: "endsWith",
                        },
                        {
                          label: t("typebot.form.triggerOperator.regex"),
                          value: "regex",
                        },
                      ]}
                    />
                    <FormInput
                      name="triggerValue"
                      label={t("typebot.form.triggerValue.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("typebot.form.triggerConditions.label")}
                    required
                  >
                    <Input />
                  </FormInput>
                )}

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("typebot.form.generalSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormInput name="expire" label={t("typebot.form.expire.label")}>
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="keywordFinish"
                  label={t("typebot.form.keywordFinish.label")}
                >
                  <Input />
                </FormInput>

                <FormInput
                  name="delayMessage"
                  label={t("typebot.form.delayMessage.label")}
                >
                  <Input type="number" />
                </FormInput>

                <FormInput
                  name="unknownMessage"
                  label={t("typebot.form.unknownMessage.label")}
                >
                  <Input />
                </FormInput>
                <FormSwitch
                  name="listeningFromMe"
                  label={t("typebot.form.listeningFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="stopBotFromMe"
                  label={t("typebot.form.stopBotFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="keepOpen"
                  label={t("typebot.form.keepOpen.label")}
                  reverse
                />
                <FormInput
                  name="debounceTime"
                  label={t("typebot.form.debounceTime.label")}
                >
                  <Input type="number" />
                </FormInput>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} type="submit">
                {t("typebot.button.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewTypebot };
