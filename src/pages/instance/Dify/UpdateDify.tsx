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

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import { deleteDify, getDify, updateDify } from "@/services/dify.service";

import { Dify, Instance } from "@/types/evolution.types";

import { SessionsDify } from "./SessionsDify";

const formSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  botType: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
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
});
type FormSchema = z.infer<typeof formSchema>;

type UpdateDifyProps = {
  difyId: string;
  instance: Instance | null;
  resetTable: () => void;
};

function UpdateDify({ difyId, instance, resetTable }: UpdateDifyProps) {
  const { t } = useTranslation();
  const [, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      description: "",
      botType: "chatBot",
      apiUrl: "",
      apiKey: "",
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
        const storedToken = getToken(TOKEN_ID.TOKEN);

        if (storedToken && instance && instance.name && difyId) {
          setToken(storedToken);

          const data: Dify = await getDify(instance.name, storedToken, difyId);

          form.reset({
            enabled: data.enabled,
            description: data.description,
            botType: data.botType,
            apiUrl: data.apiUrl,
            apiKey: data.apiKey,
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

    fetchData();
  }, [form, instance, difyId]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const storedToken = getToken(TOKEN_ID.TOKEN);

      if (storedToken && instance && instance.name && difyId) {
        const difyData: Dify = {
          enabled: data.enabled,
          description: data.description,
          botType: data.botType,
          apiUrl: data.apiUrl,
          apiKey: data.apiKey,
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

        await updateDify(instance.name, storedToken, difyId, difyData);
        toast.success(t("dify.toast.success.update"));
      } else {
        console.error("Token not found");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = getToken(TOKEN_ID.TOKEN);

      if (storedToken && instance && instance.name && difyId) {
        await deleteDify(instance.name, storedToken, difyId);
        toast.success(t("dify.toast.success.delete"));

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

  const botDescription = form.watch("description");
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
                  Dify: {botDescription}
                </h3>
                <FormSwitch
                  name="enabled"
                  className="flex items-center gap-3"
                />
              </div>
              <div className="space-y-4">
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
                  required
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
                  required
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

            <div className="flex items-center justify-between">
              <SessionsDify difyId={difyId} />
              <div className="flex items-center gap-3">
                <Dialog
                  open={openDeletionDialog}
                  onOpenChange={setOpenDeletionDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      {t("dify.button.delete")}
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
                <Button type="submit">{t("dify.button.update")}</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}

export { UpdateDify };
