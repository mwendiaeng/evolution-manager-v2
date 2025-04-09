import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSwitch } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useInstance } from "@/contexts/InstanceContext";

import { useManageInstance } from "@/lib/queries/instance/manageInstance";
import { useFetchSettings } from "@/lib/queries/instance/settingsFind";

import { Settings as SettingsType } from "@/types/evolution.types";

const FormSchema = z.object({
  rejectCall: z.boolean(),
  msgCall: z.string().optional(),
  groupsIgnore: z.boolean(),
  alwaysOnline: z.boolean(),
  readMessages: z.boolean(),
  syncFullHistory: z.boolean(),
  readStatus: z.boolean(),
});

function Settings() {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);

  const { instance } = useInstance();
  const { updateSettings } = useManageInstance();
  const { data: settings, isLoading: loading } = useFetchSettings({
    instanceName: instance?.instanceName,
    token: instance?.apikey,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rejectCall: false,
      msgCall: "",
      groupsIgnore: false,
      alwaysOnline: false,
      readMessages: false,
      syncFullHistory: false,
      readStatus: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        rejectCall: settings.reject_call,
        msgCall: settings.msg_call || "",
        groupsIgnore: settings.groups_ignore,
        alwaysOnline: settings.always_online,
        readMessages: settings.read_messages,
        syncFullHistory: settings.sync_full_history,
        readStatus: settings.read_status,
      });
    }
  }, [form, settings]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.instanceName) {
        throw new Error("instance not found");
      }

      setUpdating(true);
      const settingData: SettingsType = {
        reject_call: data.rejectCall,
        msg_call: data.msgCall,
        groups_ignore: data.groupsIgnore,
        always_online: data.alwaysOnline,
        read_messages: data.readMessages,
        sync_full_history: data.syncFullHistory,
        read_status: data.readStatus,
      };
      await updateSettings({
        instanceName: instance.instanceName,
        token: instance.apikey,
        data: settingData,
      });
      toast.success(t("settings.toast.success"));
    } catch (error) {
      console.error(t("settings.toast.success"), error);
      toast.error(t("settings.toast.error"));
    } finally {
      setUpdating(false);
    }
  };

  const fields = [
    {
      name: "groupsIgnore",
      label: t("settings.form.groupsIgnore.label"),
      description: t("settings.form.groupsIgnore.description"),
    },
    {
      name: "alwaysOnline",
      label: t("settings.form.alwaysOnline.label"),
      description: t("settings.form.alwaysOnline.description"),
    },
    {
      name: "readMessages",
      label: t("settings.form.readMessages.label"),
      description: t("settings.form.readMessages.description"),
    },
    {
      name: "syncFullHistory",
      label: t("settings.form.syncFullHistory.label"),
      description: t("settings.form.syncFullHistory.description"),
    },
    {
      name: "readStatus",
      label: t("settings.form.readStatus.label"),
      description: t("settings.form.readStatus.description"),
    },
  ];

  const isRejectCall = form.watch("rejectCall");

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">{t("settings.title")}</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y">
              <div className="flex flex-col p-4">
                <FormSwitch
                  name="rejectCall"
                  label={t("settings.form.rejectCall.label")}
                  className="w-full justify-between"
                  helper={t("settings.form.rejectCall.description")}
                />
                {isRejectCall && (
                  <div className="mr-16 mt-2">
                    <FormInput name="msgCall">
                      <Textarea
                        placeholder={t("settings.form.msgCall.description")}
                      />
                    </FormInput>
                  </div>
                )}
              </div>
              {fields.map((field) => (
                <div className="flex p-4" key={field.name}>
                  <FormSwitch
                    name={field.name}
                    label={field.label}
                    className="w-full justify-between"
                    helper={field.description}
                  />
                </div>
              ))}
              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={updating}>
                  {updating
                    ? t("settings.button.saving")
                    : t("settings.button.save")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Settings };
