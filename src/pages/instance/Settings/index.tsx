import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSwitch } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useInstance } from "@/contexts/InstanceContext";

import { settingsfind, updateSettings } from "@/services/instances.service";

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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState("");

  const { instance } = useInstance();

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
        if (instance && instance.name && instance.token) {
          setToken(instance.token);

          const data: SettingsType = await settingsfind(
            instance.name,
            instance.token,
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
          console.error("Token ou nome da instância não encontrados.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [form, instance]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
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
      };
      await updateSettings(instance.name, token, settingData);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações.");
    } finally {
      setUpdating(false);
    }
  };

  const fields = [
    {
      name: "groupsIgnore",
      label: "Ignorar Grupos",
      description: "Ignora eventos de grupos no Whatsapp",
    },
    {
      name: "alwaysOnline",
      label: "Sempre Online",
      description: "Mantém o Whatsapp sempre online",
    },
    {
      name: "readMessages",
      label: "Visualizar Mensagens",
      description: "Visualiza mensagens automaticamente",
    },
    {
      name: "syncFullHistory",
      label: "Sincronizar Histórico Completo",
      description:
        "Sincroniza o histórico completo de mensagens ao ler o qrcode",
    },
    {
      name: "readStatus",
      label: "Visualizar Status",
      description: "Recebe eventos dos broadcasts e visualiza todos os status",
    },
  ];

  const isRejectCall = form.watch("rejectCall");

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">Comportamento</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y">
              <div className="flex flex-col px-4 py-4">
                <FormSwitch
                  name="rejectCall"
                  label="Rejeitar Chamadas"
                  className="w-full justify-between"
                  helper="Rejeitas chamadas de voz e vídeo no Whatsapp"
                />
                {isRejectCall && (
                  <div className="mr-16 mt-2">
                    <FormInput name="msgCall">
                      <Textarea placeholder="Mensagem ao rejeitar chamada" />
                    </FormInput>
                  </div>
                )}
              </div>
              {fields.map((field) => (
                <div className="flex px-4 py-4" key={field.name}>
                  <FormSwitch
                    name={field.name}
                    label={field.label}
                    className="w-full justify-between"
                    helper={field.description}
                  />
                </div>
              ))}
              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={updating}>
                  {updating ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}

export { Settings };
