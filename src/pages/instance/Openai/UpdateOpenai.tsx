import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormInput, FormSelect, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import {
  deleteOpenai,
  findOpenaiCreds,
  getModels,
  getOpenai,
  updateOpenai,
} from "@/services/openai.service";

import {
  Instance,
  ModelOpenai,
  OpenaiBot,
  OpenaiCreds,
} from "@/types/evolution.types";

import { SessionsOpenai } from "./SessionsOpenai";

const formSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  openaiCredsId: z.string(),
  botType: z.string(),
  assistantId: z.string(),
  functionUrl: z.string().optional(),
  model: z.string(),
  systemMessages: z.string(),
  assistantMessages: z.string(),
  userMessages: z.string(),
  maxTokens: z.coerce.number(),
  triggerType: z.string(),
  triggerOperator: z.string().optional(),
  triggerValue: z.string().optional(),
  expire: z.coerce.number(),
  keywordFinish: z.string(),
  delayMessage: z.coerce.number(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.coerce.number(),
  ignoreJids: z.array(z.string()).default([]),
});
type FormSchema = z.infer<typeof formSchema>;

type UpdateOpenaiProps = {
  botId: string;
  instance: Instance | null;
  resetTable: () => void;
};

function UpdateOpenai({ botId, instance, resetTable }: UpdateOpenaiProps) {
  const { t } = useTranslation();
  const [, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);
  const [models, setModels] = useState<ModelOpenai[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[]>([]);

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      description: "",
      openaiCredsId: "",
      botType: "assistant",
      assistantId: "",
      functionUrl: "",
      model: "gpt-3.5-turbo",
      systemMessages: "",
      assistantMessages: "",
      userMessages: "",
      maxTokens: 300,
      triggerType: "keyword",
      triggerOperator: "contains",
      triggerValue: "",
      expire: 0,
      keywordFinish: "",
      delayMessage: 0,
      unknownMessage: "",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instance && instance.name && botId) {
          setToken(storedToken);

          const data: OpenaiBot = await getOpenai(
            instance.name,
            storedToken,
            botId,
          );

          form.reset({
            enabled: data.enabled,
            description: data.description,
            openaiCredsId: data.openaiCredsId,
            botType: data.botType,
            assistantId: data.assistantId,
            functionUrl: data.functionUrl,
            model: data.model,
            systemMessages: data.systemMessages.toString(),
            assistantMessages: data.assistantMessages.toString(),
            userMessages: data.userMessages.toString(),
            maxTokens: data.maxTokens,
            triggerType: data.triggerType,
            triggerOperator: data.triggerOperator,
            triggerValue: data.triggerValue,
            expire: data.expire,
            keywordFinish: data.keywordFinish,
            delayMessage: data.delayMessage,
            unknownMessage: data.unknownMessage,
            listeningFromMe: data.listeningFromMe,
            stopBotFromMe: data.stopBotFromMe,
            keepOpen: data.keepOpen,
            debounceTime: data.debounceTime,
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

    const fetchModels = async () => {
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
    fetchModels();
  }, [form, instance, botId]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && botId) {
        const openaiBotData: OpenaiBot = {
          enabled: data.enabled,
          description: data.description,
          openaiCredsId: data.openaiCredsId,
          botType: data.botType,
          assistantId: data.assistantId,
          functionUrl: data.functionUrl || "",
          model: data.model,
          systemMessages: [data.systemMessages],
          assistantMessages: [data.assistantMessages],
          userMessages: [data.userMessages],
          maxTokens: data.maxTokens,
          triggerType: data.triggerType,
          triggerOperator: data.triggerOperator || "",
          triggerValue: data.triggerValue || "",
          expire: data.expire,
          keywordFinish: data.keywordFinish,
          delayMessage: data.delayMessage,
          unknownMessage: data.unknownMessage,
          listeningFromMe: data.listeningFromMe,
          stopBotFromMe: data.stopBotFromMe,
          keepOpen: data.keepOpen,
          debounceTime: data.debounceTime,
        };

        await updateOpenai(instance.name, storedToken, botId, openaiBotData);
        toast.success(t("openai.toast.success.update"));
      } else {
        console.error("Instance not found");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && botId) {
        await deleteOpenai(instance.name, storedToken, botId);
        toast.success(t("openai.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/openai`);
      } else {
        console.error("Instance not found.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const botDescription = form.watch("description");
  const botType = form.watch("botType");
  const triggerType = form.watch("triggerType");

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 pl-4 pr-2"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="mb-4 text-lg font-medium">
                  OpenAI: {botDescription}
                </h3>
                <FormSwitch
                  name="enabled"
                  className="flex items-center gap-3"
                />
              </div>
              <div className="space-y-4">
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
                    >
                      <Input />
                    </FormInput>
                    <FormInput
                      name="functionUrl"
                      label={t("openai.form.functionUrl.label")}
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
                      label={t("openai.form.maxTokens")}
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
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("openai.form.triggerConditions.label")}
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

            <div className="flex items-center justify-between">
              <SessionsOpenai botId={botId} />
              <div className="flex items-center gap-3">
                <Dialog
                  open={openDeletionDialog}
                  onOpenChange={setOpenDeletionDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      {t("openai.button.delete")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("modal.delete.title")}</DialogTitle>
                      <DialogDescription>
                        {t("modal.delete.messageSingle")}
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenDeletionDialog(false)}
                        >
                          {t("button.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          {t("button.delete")}
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button type="submit">{t("openai.button.update")}</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}

export { UpdateOpenai };
