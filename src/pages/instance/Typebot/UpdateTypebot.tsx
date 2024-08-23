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

import {
  deleteTypebot,
  getTypebot,
  updateTypebot,
} from "@/services/typebot.service";

import { Instance, Typebot } from "@/types/evolution.types";

import { SessionsTypebot } from "./SessionsTypebot";

const formSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  url: z.string().url(),
  typebot: z.string(),
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

type UpdateTypebotProps = {
  typebotId: string;
  instance: Instance | null;
  resetTable: () => void;
};

function UpdateTypebot({
  typebotId,
  instance,
  resetTable,
}: UpdateTypebotProps) {
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
      url: "",
      typebot: "",
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
      ignoreJids: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instance && instance.name && typebotId) {
          setToken(storedToken);

          const data: Typebot = await getTypebot(
            instance.name,
            storedToken,
            typebotId,
          );

          form.reset({
            enabled: data.enabled,
            description: data.description,
            url: data.url,
            typebot: data.typebot,
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
          console.error("Token not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [form, instance, typebotId]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && typebotId) {
        const typebotData: Typebot = {
          enabled: data.enabled,
          description: data.description,
          url: data.url,
          typebot: data.typebot,
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

        await updateTypebot(instance.name, storedToken, typebotId, typebotData);
        toast.success(t("typebot.toast.success.update"));
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
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && typebotId) {
        await deleteTypebot(instance.name, storedToken, typebotId);
        toast.success(t("typebot.toast.success.delete"));

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/typebot`);
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Error:", error);
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
                  Typebot: {botDescription}
                </h3>
                <FormSwitch
                  name="enabled"
                  className="flex items-center gap-3"
                />
              </div>
              <div className="space-y-4">
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
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput
                    name="triggerValue"
                    label={t("typebot.form.triggerConditions.label")}
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
                  label={t("typebot.form.delay.label")}
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

            <div className="flex items-center justify-between">
              <SessionsTypebot typebotId={typebotId} />
              <div className="flex items-center gap-3">
                <Dialog
                  open={openDeletionDialog}
                  onOpenChange={setOpenDeletionDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      {t("typebot.button.delete")}
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
                <Button type="submit">{t("typebot.button.update")}</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}

export { UpdateTypebot };
