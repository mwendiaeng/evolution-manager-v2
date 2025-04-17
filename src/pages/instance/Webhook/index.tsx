/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormSwitch,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useInstance } from "@/contexts/InstanceContext";

import { useManageInstance } from "@/lib/queries/instance/manageInstance";
import { cn } from "@/lib/utils";

import { Webhook as WebhookType } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  webhookUrl: z.string().url("Invalid URL format"),
  subscribe: z.array(z.string()),
});

type FormSchemaType = z.infer<typeof FormSchema>;

function Webhook() {
  const { t } = useTranslation();
  const { instance } = useInstance();
  const [loading, setLoading] = useState(false);

  const { connect } = useManageInstance();

  const eventsOptions = [
    "MESSAGE",
    "SEND_MESSAGE",
    "READ_RECEIPT",
    "PRESENCE",
    "HISTORY_SYNC",
    "CHAT_PRESENCE",
    "CALL",
    "CONNECTION",
    "QRCODE",
    "LABEL",
    "CONTACT",
    "GROUP",
    "NEWSLETTER",
  ];

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: false,
      webhookUrl: "",
      subscribe: [],
    },
  });

  useEffect(() => {
    if (instance) {
      let events = [];

      if (instance.events === "ALL") {
        events = eventsOptions;
      } else {
        events = instance.events.split(",") || [];
      }

      form.reset({
        enabled: instance.webhook !== "",
        webhookUrl: instance.webhook,
        subscribe: events,
      });
    }
  }, [instance, eventsOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: FormSchemaType) => {
    if (!instance) return;
    setLoading(true);
    try {
      const webhookData: WebhookType = {
        enabled: data.enabled,
        webhookUrl: data.webhookUrl,
        subscribe: data.subscribe,
      };

      if (webhookData.enabled && webhookData.subscribe.length === 0) {
        webhookData.subscribe = ["ALL"];
      }

      await connect({
        webhookUrl: webhookData.enabled ? webhookData.webhookUrl : "",
        subscribe: webhookData.subscribe,
        token: instance.token,
      });

      toast.success(t("webhook.toast.success"));
    } catch (error: any) {
      console.error(t("webhook.toast.error"), error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    form.setValue("subscribe", eventsOptions);
  };

  const handleDeselectAll = () => {
    form.setValue("subscribe", []);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">{t("webhook.title")}</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:p-4">
              <FormSwitch
                name="enabled"
                label={t("webhook.form.enabled.label")}
                className="w-full justify-between"
                helper={t("webhook.form.enabled.description")}
              />
              <FormInput name="webhookUrl" label="URL">
                <Input />
              </FormInput>
              <div className="mb-4 flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleSelectAll}
                >
                  {t("button.markAll")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleDeselectAll}
                >
                  {t("button.unMarkAll")}
                </Button>
              </div>
              <FormField
                control={form.control}
                name="subscribe"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="my-2 text-lg">
                      {t("webhook.form.events.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 space-y-1 divide-y">
                        {eventsOptions
                          .sort((a, b) => a.localeCompare(b))
                          .map((event) => (
                            <div
                              key={event}
                              className="flex items-center justify-between gap-3 pt-3"
                            >
                              <FormLabel
                                className={cn(
                                  "break-all",
                                  field.value.includes(event)
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {event}
                              </FormLabel>
                              <Switch
                                checked={field.value.includes(event)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, event]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((e) => e !== event),
                                    );
                                  }
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mx-4 flex justify-end pt-6">
              <Button type="submit" disabled={loading}>
                {loading
                  ? t("webhook.button.saving")
                  : t("webhook.button.save")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Webhook };
