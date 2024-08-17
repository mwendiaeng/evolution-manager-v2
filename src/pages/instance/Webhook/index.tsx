/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

import { cn } from "@/lib/utils";

import { createWebhook, fetchWebhook } from "@/services/webhook.service";

import { Webhook as WebhookType } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  url: z.string().url("Invalid URL format"),
  events: z.array(z.string()),
  webhookBase64: z.boolean(),
  webhookByEvents: z.boolean(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

function Webhook() {
  const { instance } = useInstance();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: false,
      url: "",
      events: [],
      webhookBase64: false,
      webhookByEvents: false,
    },
  });

  useEffect(() => {
    const loadWebhookData = async () => {
      if (!instance) return;
      setLoading(true);
      try {
        const data = await fetchWebhook(instance.name, instance.token);
        form.reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do webhook:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWebhookData();
  }, [instance, form]);

  const onSubmit = async (data: FormSchemaType) => {
    if (!instance) return;
    setLoading(true);
    try {
      const webhookData: WebhookType = {
        enabled: data.enabled,
        url: data.url,
        events: data.events,
        webhookBase64: data.webhookBase64,
        webhookByEvents: data.webhookByEvents,
      };

      await createWebhook(instance.name, instance.token, webhookData);
      toast.success("Webhook criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar webhook:", error);
      toast.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const events = [
    "APPLICATION_STARTUP",
    "QRCODE_UPDATED",
    "MESSAGES_SET",
    "MESSAGES_UPSERT",
    "MESSAGES_UPDATE",
    "MESSAGES_DELETE",
    "SEND_MESSAGE",
    "CONTACTS_SET",
    "CONTACTS_UPSERT",
    "CONTACTS_UPDATE",
    "PRESENCE_UPDATE",
    "CHATS_SET",
    "CHATS_UPSERT",
    "CHATS_UPDATE",
    "CHATS_DELETE",
    "GROUPS_UPSERT",
    "GROUP_UPDATE",
    "GROUP_PARTICIPANTS_UPDATE",
    "CONNECTION_UPDATE",
    "LABELS_EDIT",
    "LABELS_ASSOCIATION",
    "CALL",
    "TYPEBOT_START",
    "TYPEBOT_CHANGE_STATUS",
  ];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">Webhook</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:p-4">
              <FormSwitch
                name="enabled"
                label="Ativo"
                className="w-full justify-between"
                helper="Ativa ou desativa o webhook"
              />
              <FormInput name="url" label="URL">
                <Input />
              </FormInput>
              <FormSwitch
                name="webhookByEvents"
                label="Webhook por Eventos"
                className="w-full justify-between"
                helper="Cria uma rota para cada evento adicionando o nome do evento no final da URL"
              />
              <FormSwitch
                name="webhookBase64"
                label="Base64 no Webhook"
                className="w-full justify-between"
                helper="Envie os dados do base64 das mídias no webhook"
              />
              <FormField
                control={form.control}
                name="events"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="my-2 text-lg">Eventos</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 space-y-1 divide-y">
                        {events
                          .sort((a, b) => a.localeCompare(b))
                          .map((event) => (
                            <div
                              key={event}
                              className="flex items-center justify-between gap-3 pt-3"
                            >
                              <FormLabel
                                className={cn(
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Webhook };
