/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { createWebhook, fetchWebhook } from "@/services/webhook.service";
import { useInstance } from "@/contexts/InstanceContext";
import toastService from "@/utils/custom-toast.service";
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

  const onSubmit = async () => {
    if (!instance) return;

    const data = form.getValues();

    console.log("data", data);
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
      toastService.success("Webhook criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar webhook:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
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
    <main className="main-content">
      <Form {...form}>
        <form className="w-full space-y-6">
          <div>
            <h3 className="mb-1 text-lg font-medium">Webhook</h3>
            <Separator className="my-4 border-t border-gray-600" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Ativo</FormLabel>
                      <FormDescription>
                        Ativa ou desativa o webhook
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="URL"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="webhookByEvents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">
                        Webhook por Eventos
                      </FormLabel>
                      <FormDescription>
                        Cria uma rota para cada evento adicionando o nome do
                        evento no final da URL
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webhookBase64"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">
                        Base64 no Webhook
                      </FormLabel>
                      <FormDescription>
                        Envie os dados do base64 das mídias no webhook
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="events"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Eventos</FormLabel>
                    <FormControl>
                      <>
                        {events.map((event) => (
                          <div
                            key={event}
                            className="flex items-center justify-between rounded-lg border border-gray-600 p-4"
                          >
                            <span>{event}</span>
                            <Switch
                              checked={field.value.includes(event)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, event]);
                                } else {
                                  field.onChange(
                                    field.value.filter((e) => e !== event)
                                  );
                                }
                              }}
                            />
                          </div>
                        ))}
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} onClick={onSubmit}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

export { Webhook };
