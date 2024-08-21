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

import { createGenericBot } from "@/services/genericBot.service";

import { GenericBot } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
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
});

function NewGenericBot({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      apiUrl: "",
      apiKey: "",
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
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("instance not found");
      }

      setUpdating(true);
      const genericBotData: GenericBot = {
        enabled: data.enabled,
        description: data.description,
        apiUrl: data.apiUrl,
        apiKey: data.apiKey,
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

      await createGenericBot(instance.name, instance.token, genericBotData);
      toast.success(t("genericBot.toast.success.create"));
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
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
        <Button size="sm">
          <PlusIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">
            {t("genericBot.button.create")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("genericBot.form.title")}</DialogTitle>
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
                  label={t("genericBot.form.enabled.label")}
                  reverse
                />
                <FormInput
                  name="description"
                  label={t("genericBot.form.description.label")}
                  required
                >
                  <Input />
                </FormInput>

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("genericBot.form.genericBotSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormInput
                  name="apiUrl"
                  label={t("genericBot.form.apiUrl.label")}
                  required
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="apiKey"
                  label={t("genericBot.form.apiKey.label")}
                  required
                >
                  <Input type="password" />
                </FormInput>

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("genericBot.form.triggerSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label={t("genericBot.form.triggerType.label")}
                  options={[
                    {
                      label: t("genericBot.form.triggerType.keyword"),
                      value: "keyword",
                    },
                    {
                      label: t("genericBot.form.triggerType.all"),
                      value: "all",
                    },
                    {
                      label: t("genericBot.form.triggerType.advanced"),
                      value: "advanced",
                    },
                    {
                      label: t("genericBot.form.triggerType.none"),
                      value: "none",
                    },
                  ]}
                  required
                />

                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label={t("genericBot.form.triggerOperator.label")}
                      options={[
                        {
                          label: t("genericBot.form.triggerOperator.contains"),
                          value: "contains",
                        },
                        {
                          label: t("genericBot.form.triggerOperator.equals"),
                          value: "equals",
                        },
                        {
                          label: t(
                            "genericBot.form.triggerOperator.startsWith",
                          ),
                          value: "startsWith",
                        },
                        {
                          label: t("genericBot.form.triggerOperator.endsWith"),
                          value: "endsWith",
                        },
                        {
                          label: t("genericBot.form.triggerOperator.regex"),
                          value: "regex",
                        },
                      ]}
                      required
                    />
                    <FormInput
                      name="triggerValue"
                      label={t("genericBot.form.triggerValue.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("genericBot.form.triggerConditions.label")}
                    required
                  >
                    <Input />
                  </FormInput>
                )}
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("genericBot.form.generalSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormInput
                  name="expire"
                  label={t("genericBot.form.expire.label")}
                >
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="keywordFinish"
                  label={t("genericBot.form.keywordFinish.label")}
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="delayMessage"
                  label={t("genericBot.form.delayMessage.label")}
                >
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="unknownMessage"
                  label={t("genericBot.form.unknownMessage.label")}
                >
                  <Input />
                </FormInput>
                <FormSwitch
                  name="listeningFromMe"
                  label={t("genericBot.form.listeningFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="stopBotFromMe"
                  label={t("genericBot.form.stopBotFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="keepOpen"
                  label={t("genericBot.form.keepOpen.label")}
                  reverse
                />
                <FormInput
                  name="debounceTime"
                  label={t("genericBot.form.debounceTime.label")}
                >
                  <Input type="number" />
                </FormInput>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} type="submit">
                {t("genericBot.button.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewGenericBot };
