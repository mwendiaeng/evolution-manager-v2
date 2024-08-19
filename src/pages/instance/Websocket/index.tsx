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
  FormItem,
  FormLabel,
  FormSwitch,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { useInstance } from "@/contexts/InstanceContext";

import { cn } from "@/lib/utils";

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

  const onSubmit = async (data: FormSchemaType) => {
    if (!instance) return;

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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">Websocket</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:p-4">
              <FormSwitch
                name="enabled"
                label="Ativo"
                className="w-full justify-between"
                helper="Ativa ou desativa o websocket"
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Websocket };
