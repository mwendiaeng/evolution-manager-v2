/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Cog } from "lucide-react";
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
import {
  FormInput,
  FormSelect,
  FormSwitch,
  FormTags,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import {
  findDefaultSettingsDify,
  findDify,
  setDefaultSettingsDify,
} from "@/services/dify.service";

import { Dify, DifySettings, Instance } from "@/types/evolution.types";

const FormSchema = z.object({
  expire: z.string(),
  keywordFinish: z.string(),
  delayMessage: z.string(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.string(),
  ignoreJids: z.array(z.string()).default([]),
  difyIdFallback: z.union([z.null(), z.string()]).optional(),
});

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setBots: any,
) => {
  try {
    const storedToken = getToken(TOKEN_ID.TOKEN);

    if (storedToken && instance && instance.name) {
      const getSettings: DifySettings[] = await findDefaultSettingsDify(
        instance.name,
        storedToken,
      );

      setSettings(getSettings);

      const getBots: Dify[] = await findDify(instance.name, storedToken);

      setBots(getBots);
    } else {
      console.error("Token not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function DefaultSettingsDify() {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<DifySettings>();
  const [bots, setBots] = useState<Dify[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      expire: "0",
      keywordFinish: t("dify.form.examples.keywordFinish"),
      delayMessage: "1000",
      unknownMessage: t("dify.form.examples.unknownMessage"),
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: "0",
      ignoreJids: [],
      difyIdFallback: undefined,
    },
  });

  useEffect(() => {
    if (open) fetchData(instance, setSettings, setBots);
  }, [instance, open]);

  useEffect(() => {
    if (settings) {
      form.reset({
        expire: settings?.expire ? settings.expire.toString() : "0",
        keywordFinish: settings.keywordFinish,
        delayMessage: settings.delayMessage
          ? settings.delayMessage.toString()
          : "0",
        unknownMessage: settings.unknownMessage,
        listeningFromMe: settings.listeningFromMe,
        stopBotFromMe: settings.stopBotFromMe,
        keepOpen: settings.keepOpen,
        debounceTime: settings.debounceTime
          ? settings.debounceTime.toString()
          : "0",
        ignoreJids: settings.ignoreJids,
        difyIdFallback: settings.difyIdFallback,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("instance not found.");
      }

      const settingsData: DifySettings = {
        expire: parseInt(data.expire),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime),
        difyIdFallback: data.difyIdFallback || undefined,
        ignoreJids: data.ignoreJids,
      };

      await setDefaultSettingsDify(instance.name, instance.token, settingsData);
      toast.success(t("dify.toast.defaultSettings.success"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    }
  };

  function onReset() {
    fetchData(instance, setSettings, setBots);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Cog size={16} className="mr-1" />
          <span className="hidden sm:inline">{t("dify.defaultSettings")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("dify.defaultSettings")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <div className="space-y-4">
                <FormSelect
                  name="difyIdFallback"
                  label={t("dify.form.difyIdFallback.label")}
                  options={
                    bots
                      ?.filter((bot) => !!bot.id)
                      .map((bot) => ({
                        label: bot.description!,
                        value: bot.id!,
                      })) ?? []
                  }
                />
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

                <FormTags
                  name="ignoreJids"
                  label={t("dify.form.ignoreJids.label")}
                  placeholder={t("dify.form.ignoreJids.placeholder")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{t("dify.button.save")}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { DefaultSettingsDify };
