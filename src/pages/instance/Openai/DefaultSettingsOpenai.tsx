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
  findDefaultSettingsOpenai,
  findOpenai,
  findOpenaiCreds,
  setDefaultSettingsOpenai,
} from "@/services/openai.service";

import {
  Instance,
  OpenaiBot,
  OpenaiCreds,
  OpenaiSettings,
} from "@/types/evolution.types";

const FormSchema = z.object({
  openaiCredsId: z.string(),
  expire: z.coerce.number(),
  keywordFinish: z.string(),
  delayMessage: z.coerce.number().default(0),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.coerce.number(),
  speechToText: z.boolean(),
  ignoreJids: z.array(z.string()),
  openaiIdFallback: z.string().optional(),
});

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setBots: any,
  setCreds: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSettings: OpenaiSettings[] = await findDefaultSettingsOpenai(
        instance.name,
        storedToken,
      );

      setSettings(getSettings);

      const getBots: OpenaiBot[] = await findOpenai(instance.name, storedToken);

      setBots(getBots);

      const getCreds: OpenaiCreds[] = await findOpenaiCreds(
        instance.name,
        storedToken,
      );

      setCreds(getCreds);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
};

function DefaultSettingsOpenai() {
  const { instance } = useInstance();

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<OpenaiSettings>();
  const [bots, setBots] = useState<OpenaiBot[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[]>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      openaiCredsId: "",
      expire: 0,
      keywordFinish: "#SAIR",
      delayMessage: 1000,
      unknownMessage: "Mensagem não reconhecida",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: 0,
      speechToText: false,
      ignoreJids: [],
      openaiIdFallback: undefined,
    },
  });

  useEffect(() => {
    if (open) fetchData(instance, setSettings, setBots, setCreds);
  }, [instance, open]);

  useEffect(() => {
    if (settings) {
      form.reset({
        openaiCredsId: settings.openaiCredsId,
        expire: settings?.expire ?? 0,
        keywordFinish: settings.keywordFinish,
        delayMessage: settings.delayMessage ?? 0,
        unknownMessage: settings.unknownMessage,
        listeningFromMe: settings.listeningFromMe,
        stopBotFromMe: settings.stopBotFromMe,
        keepOpen: settings.keepOpen,
        debounceTime: settings.debounceTime ?? 0,
        speechToText: settings.speechToText,
        ignoreJids: settings.ignoreJids,
        openaiIdFallback: settings.openaiIdFallback,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      const settingsData: OpenaiSettings = {
        openaiCredsId: data.openaiCredsId,
        expire: data.expire,
        keywordFinish: data.keywordFinish,
        delayMessage: data.delayMessage,
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: data.debounceTime,
        speechToText: data.speechToText,
        openaiIdFallback: data.openaiIdFallback || undefined,
        ignoreJids: data.ignoreJids,
      };

      await setDefaultSettingsOpenai(
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
    fetchData(instance, setSettings, setBots, setCreds);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Cog size={16} className="mr-1" />
          <span className="hidden md:inline">Configurações Padrão</span>
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
                  name="openaiCredsId"
                  label="Credencial"
                  options={
                    creds
                      ?.filter((cred) => !!cred.id)
                      .map((cred) => ({
                        label: cred.name
                          ? cred.name
                          : cred.apiKey.substring(0, 15) + "...",
                        value: cred.id!,
                      })) || []
                  }
                />
                <FormSelect
                  name="openaiIdFallback"
                  label="Bot Fallback"
                  options={
                    bots
                      ?.filter((bot) => !!bot.id)
                      .map((bot) => ({
                        label: bot.id ?? "Nome não encontrado",
                        value: bot.id!,
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
                <FormSwitch
                  name="speechToText"
                  label="Converter áudio em texto"
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

export { DefaultSettingsOpenai };
