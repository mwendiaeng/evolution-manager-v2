import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselector";
import toastService from "@/utils/custom-toast.service";

const FormSchema = z.object({
  enabled: z.boolean(),
  events: z.array(z.string()),
});

function Rabbitmq() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      events: ["MESSAGES_UPSERT", "QRCODE_UPDATED"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toastService.success("You submitted");
    console.log(data);
  }

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
            <h3 className="mb-1 text-lg font-medium">Rabbitmq</h3>
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
                        Ativa ou desativa o rabbitmq
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
                      <MultiSelector
                        values={field.value}
                        onValuesChange={(values) => {
                          field.onChange(values);
                        }}
                        loop
                        className="w-full border border-gray-600"
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Selecione os Eventos" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {events.map((event) => (
                              <MultiSelectorItem key={event} value={event}>
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
            </div>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Form>
    </main>
  );
}

export { Rabbitmq };
