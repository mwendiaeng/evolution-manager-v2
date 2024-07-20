import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";

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
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  settingsfind,
  updateSettings,
} from "@/services/instances.service";
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
  const { instanceId } = useParams<{ instanceId: string }>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState("");

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
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instanceId) {
          setToken(storedToken);

          const data: SettingsType = await settingsfind(
            instanceId,
            storedToken
          );
          form.reset({
            rejectCall: data.rejectCall,
            msgCall: data.msgCall || "",
            groupsIgnore: data.groupsIgnore,
            alwaysOnline: data.alwaysOnline,
            readMessages: data.readMessages,
            syncFullHistory: data.syncFullHistory,
            readStatus: data.readStatus,
          });
        } else {
          console.error("Token ou ID da instância não encontrados.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [form, instanceId]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instanceId) {
        throw new Error("ID da instância não encontrado.");
      }

      setUpdating(true);
      const settingData: SettingsType = {
        rejectCall: data.rejectCall,
        msgCall: data.msgCall,
        groupsIgnore: data.groupsIgnore,
        alwaysOnline: data.alwaysOnline,
        readMessages: data.readMessages,
        syncFullHistory: data.syncFullHistory,
        readStatus: data.readStatus,
      }
      await updateSettings(instanceId, token, settingData);
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast({
        title: "Erro ao atualizar configurações",
        description:
          "Ocorreu um erro ao salvar as configurações. Tente novamente.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <main className="main-content">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">Comportamento</h3>
            <Separator className="my-4 border-t border-gray-600" />
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
                        Sincroniza o histórico completo de mensagens ao ler o
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
                        Recebe eventos dos broadcasts e visualiza todos os
                        status
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
          <Button type="submit" disabled={updating}>
            {updating ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

export { Settings };
