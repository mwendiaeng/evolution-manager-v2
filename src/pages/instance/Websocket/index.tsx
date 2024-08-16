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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { useInstance } from "@/contexts/InstanceContext";

import { createWebsocket, fetchWebsocket } from "@/services/websocket.service";

import { Websocket as WebsocketType } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  events: z.array(z.string()),
});

type FormSchemaType = z.infer<typeof FormSchema>;

function Websocket() {
  const { instance } = useInstance();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: false,
      events: [],
    },
  });

  useEffect(() => {
    const loadWebsocketData = async () => {
      if (!instance) return;
      setLoading(true);
      try {
        const data = await fetchWebsocket(instance.name, instance.token);
        form.reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do websocket:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWebsocketData();
  }, [instance, form]);

  const onSubmit = async () => {
    if (!instance) return;

    const data = form.getValues();

    setLoading(true);
    try {
      const websocketData: WebsocketType = {
        enabled: data.enabled,
        events: data.events,
      };

      await createWebsocket(instance.name, instance.token, websocketData);
      toast.success("Websocket criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar websocket:", error);
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
    <main className="main-content">
      <Form {...form}>
        <form className="w-full space-y-6">
          <div>
            <h3 className="mb-1 text-lg font-medium">Websocket</h3>
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
                        Ativa ou desativa o websocket
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
                                    field.value.filter((e) => e !== event),
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

export { Websocket };
