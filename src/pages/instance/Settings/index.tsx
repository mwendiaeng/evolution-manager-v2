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
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  rejectCall: z.boolean(),
  msgCall: z.string(),
  groupsIgnore: z.boolean(),
  alwaysOnline: z.boolean(),
  readMessages: z.boolean(),
  syncFullHistory: z.boolean(),
  readStatus: z.boolean(),
});

function Settings() {
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-1 text-lg font-medium">Comportamento</h3>
          <hr className="border border-gray-600 mb-4" />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="rejectCall"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start rounded-lg border border-gray-600 p-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">
                        Rejeitar Chamadas
                      </FormLabel>
                      <FormDescription>
                        Rejeitas chamadas de voz e vídeo no Whatsapp
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  {field.value && (
                    <div className="w-full mt-4">
                      <FormField
                        control={form.control}
                        name="msgCall"
                        render={({ field }) => (
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Mensagem ao rejeitar chamada"
                              className="border border-gray-600 w-full"
                            />
                          </FormControl>
                        )}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupsIgnore"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Ignorar Grupos</FormLabel>
                    <FormDescription>
                      Ignora eventos de grupos no Whatsapp
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
              name="alwaysOnline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Sempre Online</FormLabel>
                    <FormDescription>
                      Mantém o Whatsapp sempre online
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
              name="readMessages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      Visualizar Mensagens
                    </FormLabel>
                    <FormDescription>
                      Visualiza mensagens automaticamente
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
              name="syncFullHistory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      Sincronizar Histórico Completo
                    </FormLabel>
                    <FormDescription>
                      Sinconiza o histórico completo de mensagens ao ler o
                      qrcode
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
              name="readStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      Visualizar Status
                    </FormLabel>
                    <FormDescription>
                      Recebe eventos dos broadcasts e visualiza todos os status
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
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}

export { Settings };
