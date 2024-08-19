/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { useInstance } from "@/contexts/InstanceContext";

import {
  createOpenai,
  findOpenaiCreds,
  getModels,
} from "@/services/openai.service";

import { ModelOpenai, OpenaiBot, OpenaiCreds } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  openaiCredsId: z.string(),
  botType: z.string(),
  assistantId: z.string(),
  functionUrl: z.string(),
  model: z.string(),
  systemMessages: z.string(),
  assistantMessages: z.string(),
  userMessages: z.string(),
  maxTokens: z.string(),
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

function NewOpenai({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<ModelOpenai[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      openaiCredsId: "",
      botType: "assistant",
      assistantId: "",
      functionUrl: "",
      model: "gpt-4o-mini",
      systemMessages: "",
      assistantMessages: "",
      userMessages: "",
      maxTokens: "300",
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

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          if (!instance) return;
          const response = await getModels(instance.name, instance.token);

          setModels(response);

          const getCreds: OpenaiCreds[] = await findOpenaiCreds(
            instance.name,
            instance.token,
          );

          setCreds(getCreds);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }
  }, [instance, open]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("instance not found.");
      }

      setUpdating(true);
      const openaiData: OpenaiBot = {
        enabled: data.enabled,
        description: data.description,
        openaiCredsId: data.openaiCredsId,
        botType: data.botType,
        assistantId: data.assistantId,
        functionUrl: data.functionUrl,
        model: data.model,
        systemMessages: [data.systemMessages],
        assistantMessages: [data.assistantMessages],
        userMessages: [data.userMessages],
        maxTokens: parseInt(data.maxTokens, 10),
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

      await createOpenai(instance.name, instance.token, openaiData);
      toast.success(t("openai.toast.success.create"));
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

  const botType = form.watch("botType");
  const triggerType = form.watch("triggerType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">{t("openai.button.create")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl" onCloseAutoFocus={onReset}>
        <DialogHeader>
          <DialogTitle>{t("openai.form.title")}</DialogTitle>
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
                  label={t("openai.form.enabled.label")}
                  reverse
                />
                <FormInput
                  name="description"
                  label={t("openai.form.description.label")}
                  required
                >
                  <Input />
                </FormInput>
                <FormSelect
                  name="openaiCredsId"
                  label={t("openai.form.openaiCredsId.label")}
                  required
                  options={creds
                    .filter((cred) => !!cred.id)
                    .map((cred) => ({
                      label: cred.name
                        ? cred.name
                        : cred.apiKey.substring(0, 15) + "...",
                      value: cred.id!,
                    }))}
                />
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("openai.form.openaiSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="botType"
                  label={t("openai.form.botType.label")}
                  required
                  options={[
                    {
                      label: t("openai.form.botType.assistant"),
                      value: "assistant",
                    },
                    {
                      label: t("openai.form.botType.chatCompletion"),
                      value: "chatCompletion",
                    },
                  ]}
                />
                {botType === "assistant" && (
                  <>
                    <FormInput
                      name="assistantId"
                      label={t("openai.form.assistantId.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                    <FormInput
                      name="functionUrl"
                      label={t("openai.form.functionUrl.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {botType === "chatCompletion" && (
                  <>
                    <FormSelect
                      name="model"
                      label={t("openai.form.model.label")}
                      required
                      options={models.map((model) => ({
                        label: model.id,
                        value: model.id,
                      }))}
                    />
                    <FormInput
                      name="systemMessages"
                      label={t("openai.form.systemMessages.label")}
                    >
                      <Textarea />
                    </FormInput>
                    <FormInput
                      name="assistantMessages"
                      label={t("openai.form.assistantMessages.label")}
                    >
                      <Textarea />
                    </FormInput>
                    <FormInput
                      name="userMessages"
                      label={t("openai.form.userMessages.label")}
                    >
                      <Textarea />
                    </FormInput>

                    <FormInput
                      name="maxTokens"
                      label={t("openai.form.maxTokens.label")}
                    >
                      <Input type="number" />
                    </FormInput>
                  </>
                )}

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("openai.form.triggerSettings.label")}
                  </h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label={t("openai.form.triggerType.label")}
                  required
                  options={[
                    {
                      label: t("openai.form.triggerType.keyword"),
                      value: "keyword",
                    },
                    { label: t("openai.form.triggerType.all"), value: "all" },
                    {
                      label: t("openai.form.triggerType.advanced"),
                      value: "advanced",
                    },
                    { label: t("openai.form.triggerType.none"), value: "none" },
                  ]}
                />
                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label={t("openai.form.triggerOperator.label")}
                      required
                      options={[
                        {
                          label: t("openai.form.triggerOperator.contains"),
                          value: "contains",
                        },
                        {
                          label: t("openai.form.triggerOperator.equals"),
                          value: "equals",
                        },
                        {
                          label: t("openai.form.triggerOperator.startsWith"),
                          value: "startsWith",
                        },
                        {
                          label: t("openai.form.triggerOperator.endsWith"),
                          value: "endsWith",
                        },
                        {
                          label: t("openai.form.triggerOperator.regex"),
                          value: "regex",
                        },
                      ]}
                    />
                    <FormInput
                      name="triggerValue"
                      label={t("openai.form.triggerValue.label")}
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("openai.form.triggerConditions.label")}
                    required
                  >
                    <Input />
                  </FormInput>
                )}

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">
                    {t("openai.form.generalSettings.label")}
                  </h3>
                  <Separator />
                </div>

                <FormInput name="expire" label={t("openai.form.expire.label")}>
                  <Input type="number" />
                </FormInput>

                <FormInput
                  name="keywordFinish"
                  label={t("openai.form.keywordFinish.label")}
                >
                  <Input />
                </FormInput>

                <FormInput
                  name="delayMessage"
                  label={t("openai.form.delayMessage.label")}
                >
                  <Input type="number" />
                </FormInput>

                <FormInput
                  name="unknownMessage"
                  label={t("openai.form.unknownMessage.label")}
                >
                  <Input />
                </FormInput>

                <FormSwitch
                  name="listeningFromMe"
                  label={t("openai.form.listeningFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="stopBotFromMe"
                  label={t("openai.form.stopBotFromMe.label")}
                  reverse
                />
                <FormSwitch
                  name="keepOpen"
                  label={t("openai.form.keepOpen.label")}
                  reverse
                />
                <FormInput
                  name="debounceTime"
                  label={t("openai.form.debounceTime.label")}
                >
                  <Input type="number" />
                </FormInput>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} type="submit">
                {updating ? t("openai.button.saving") : t("openai.button.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewOpenai };
