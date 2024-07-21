import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselector";

import { createwebhook, fetchwebhook } from "@/services/webhook";
import { useInstance } from "@/contexts/InstanceContext";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: false,
      url: "",
      events: ["MESSAGES_UPSERT", "QRCODE_UPDATED"],
      webhookBase64: false,
      webhookByEvents: false,
    },
  });

  useEffect(() => {
    const loadWebhookData = async () => {
      if (!instance) return;
      setLoading(true);
      try {
        const data = await fetchwebhook(instance.name, "your-api-key");
        form.reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do webhook:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWebhookData();
  }, [instance, form]);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    if (!instance) return;

    setLoading(true);
    try {
      await createwebhook(instance.name, "your-api-key", data);
      toast({
        title: "Webhook criado com sucesso",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Erro ao criar webhook:", error);
      toast({
        title: "Erro ao criar webhook",
        description: "Não foi possível criar o webhook. Tente novamente.",
      });
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
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
                name="events"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Eventos</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={(values) => {
                          field.onChange(values);
                        }}
                        loop
                        className="w-full border border-gray-600"
                        isOpen={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput 
                            placeholder="Selecione os Eventos"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {events.map((event) => (
                              <MultiSelectorItem 
                                key={event} 
                                value={event}
                                selected={field.value.includes(event)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newValue = field.value.includes(event)
                                    ? field.value.filter((e) => e !== event)
                                    : [...field.value, event];
                                  field.onChange(newValue);
                                }}
                              >
                                {event}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                  </FormItem>
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
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

export { Webhook };
