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

import { createDify } from "@/lib/queries/dify/manageDify";

import { Dify } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  botType: z.string(),
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

function NewDify({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      botType: "chatBot",
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
      const difyData: Dify = {
        enabled: data.enabled,
        description: data.description,
        botType: data.botType,
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

      await createDify({
        instanceName: instance.name,
        token: instance.token,
        data: difyData,
      });
      toast.success(t("dify.toast.success.create"));
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
          <span className="hidden sm:inline">{t("dify.button.create")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("dify.form.title")}</DialogTitle>
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
                  label={t("dify.form.enabled.label")}
                  reverse
                />
                <FormInput
                  name="description"
                  label={t("dify.form.description.label")}
                  required
                >
                  <Input />
                </FormInput>

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("dify.form.difySettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="botType"
                  label={t("dify.form.botType.label")}
                  options={[
                    { label: t("dify.form.botType.chatBot"), value: "chatBot" },
                    {
                      label: t("dify.form.botType.textGenerator"),
                      value: "textGenerator",
                    },
                    { label: t("dify.form.botType.agent"), value: "agent" },
                    {
                      label: t("dify.form.botType.workflow"),
                      value: "workflow",
                    },
                  ]}
                />
                <FormInput
                  name="apiUrl"
                  label={t("dify.form.apiUrl.label")}
                  required
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="apiKey"
                  label={t("dify.form.apiKey.label")}
                  required
                >
                  <Input type="password" />
                </FormInput>

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("dify.form.triggerSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label={t("dify.form.triggerType.label")}
                  options={[
                    {
                      label: t("dify.form.triggerType.keyword"),
                      value: "keyword",
                    },
                    { label: t("dify.form.triggerType.all"), value: "all" },
                    {
                      label: t("dify.form.triggerType.advanced"),
                      value: "advanced",
                    },
                    { label: t("dify.form.triggerType.none"), value: "none" },
                  ]}
                  required
                />

                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label={t("dify.form.triggerOperator.label")}
                      options={[
                        {
                          label: t("dify.form.triggerOperator.contains"),
                          value: "contains",
                        },
                        {
                          label: t("dify.form.triggerOperator.equals"),
                          value: "equals",
                        },
                        {
                          label: t("dify.form.triggerOperator.startsWith"),
                          value: "startsWith",
                        },
                        {
                          label: t("dify.form.triggerOperator.endsWith"),
                          value: "endsWith",
                        },
                        {
                          label: t("dify.form.triggerOperator.regex"),
                          value: "regex",
                        },
                      ]}
                      required
                    />
                    <FormInput
                      name="triggerValue"
                      label={t("dify.form.triggerValue.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("dify.form.triggerConditions.label")}
                    required
                  >
                    <Input />
                  </FormInput>
                )}
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("dify.form.generalSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormInput name="expire" label={t("dify.form.expire.label")}>
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="keywordFinish"
                  label={t("dify.form.keywordFinish.label")}
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="delayMessage"
                  label={t("dify.form.delayMessage.label")}
                >
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="unknownMessage"
                  label={t("dify.form.unknownMessage.label")}
                >
                  <Input />
                </FormInput>
                <FormSwitch
                  name="listeningFromMe"
                  label={t("dify.form.listeningFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="stopBotFromMe"
                  label={t("dify.form.stopBotFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="keepOpen"
                  label={t("dify.form.keepOpen.label")}
                  reverse
                />
                <FormInput
                  name="debounceTime"
                  label={t("dify.form.debounceTime.label")}
                >
                  <Input type="number" />
                </FormInput>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} type="submit">
                {t("dify.button.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewDify };
