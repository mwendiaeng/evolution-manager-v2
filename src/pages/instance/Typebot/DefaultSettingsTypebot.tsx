/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Cog } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormInput,
  FormSelect,
  FormSwitch,
  FormTags,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import {
  findDefaultSettingsTypebot,
  findTypebot,
  setDefaultSettingsTypebot,
} from "@/services/typebot.service";

import { Instance, Typebot, TypebotSettings } from "@/types/evolution.types";

const formSchema = z.object({
  expire: z.coerce.number(),
  keywordFinish: z.string(),
  delayMessage: z.coerce.number(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.coerce.number(),
  ignoreJids: z.array(z.string()).default([]),
  typebotIdFallback: z.union([z.null(), z.string()]).optional(),
});
type FormSchema = z.infer<typeof formSchema>;

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setTypebots: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSettings: TypebotSettings[] = await findDefaultSettingsTypebot(
        instance.name,
        storedToken,
      );

      setSettings(getSettings);

      const getTypebots: Typebot[] = await findTypebot(
        instance.name,
        storedToken,
      );

      setTypebots(getTypebots);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
};

function DefaultSettingsTypebot() {
  const { instance } = useInstance();

  const [settings, setSettings] = useState<TypebotSettings>();
  const [typebots, setTypebots] = useState<Typebot[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expire: 0,
      keywordFinish: "#SAIR",
      delayMessage: 1000,
      unknownMessage: "Mensagem não reconhecida",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: 0,
      ignoreJids: [],
      typebotIdFallback: undefined,
    },
  });

  useEffect(() => {
    if (open) fetchData(instance, setSettings, setTypebots);
  }, [instance, open]);

  useEffect(() => {
    if (settings) {
      form.reset({
        expire: settings?.expire ?? 0,
        keywordFinish: settings.keywordFinish,
        delayMessage: settings.delayMessage ?? 0,
        unknownMessage: settings.unknownMessage,
        listeningFromMe: settings.listeningFromMe,
        stopBotFromMe: settings.stopBotFromMe,
        keepOpen: settings.keepOpen,
        debounceTime: settings.debounceTime ?? 0,
        ignoreJids: settings.ignoreJids,
        typebotIdFallback: settings.typebotIdFallback,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = async (data: FormSchema) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      const settingsData: TypebotSettings = {
        expire: data.expire,
        keywordFinish: data.keywordFinish,
        delayMessage: data.delayMessage,
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: data.debounceTime,
        typebotIdFallback: data.typebotIdFallback || undefined,
        ignoreJids: data.ignoreJids,
      };

      await setDefaultSettingsTypebot(
        instance.name,
        instance.token,
        settingsData,
      );
      toast.success("Configuração salva com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar bot:", error);
      toast.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`,
      );
    }
  };

  function onReset() {
    fetchData(instance, setSettings, setTypebots);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Cog size={16} className="mr-1" />
          <span className="hidden sm:inline">Configurações Padrão</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>Configurações Padrão</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div>
              <div className="space-y-4">
                <FormSelect
                  name="typebotIdFallback"
                  label="Typebot Fallback"
                  options={
                    typebots
                      ?.filter((typebot) => !!typebot.id)
                      .map((typebot) => ({
                        label: typebot.typebot!,
                        value: typebot.id!,
                      })) ?? []
                  }
                />
                <FormInput name="expire" label="Expira em (minutos)">
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="keywordFinish"
                  label="Palavra Chave de Finalização"
                >
                  <Input />
                </FormInput>
                <FormInput name="delayMessage" label="Delay padrão da mensagem">
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="unknownMessage"
                  label="Mensagem para tipo de mensagem desconhecida"
                >
                  <Input />
                </FormInput>
                <FormSwitch
                  name="listeningFromMe"
                  label="Escuta mensagens enviadas por mim"
                  reverse
                />
                <FormSwitch
                  name="stopBotFromMe"
                  label="Pausa o bot quando eu enviar uma mensagem"
                  reverse
                />
                <FormSwitch
                  name="keepOpen"
                  label="Mantem a sessão do bot aberta"
                  reverse
                />
                <FormInput name="debounceTime" label="Tempo de espera">
                  <Input type="number" />
                </FormInput>

                <FormTags
                  name="ignoreJids"
                  label="Ignorar JIDs"
                  placeholder="Adicionar JIDs ex: 1234567890@s.whatsapp.net"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { DefaultSettingsTypebot };
