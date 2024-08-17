/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Cog } from "lucide-react";
import { Tag } from "node_modules/react-tag-input/types/components/SingleTag";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { WithContext as ReactTags } from "react-tag-input";
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
  FormField,
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import {
  findDefaultSettingsDify,
  findDify,
  setDefaultSettingsDify,
} from "@/services/dify.service";

import { Dify, DifySettings, Instance } from "@/types/evolution.types";

const FormSchema = z.object({
  expire: z.string(),
  keywordFinish: z.string(),
  delayMessage: z.string(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.string(),
  ignoreJids: z.array(z.string()),
  difyIdFallback: z.string().optional(),
});

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setBots: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSettings: DifySettings[] = await findDefaultSettingsDify(
        instance.name,
        storedToken,
      );

      setSettings(getSettings);

      const getBots: Dify[] = await findDify(instance.name, storedToken);

      setBots(getBots);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
};

function DefaultSettingsDify() {
  const { instance } = useInstance();

  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<DifySettings>();
  const [bots, setBots] = useState<Dify[]>([]);

  const handleDeleteTag = (i: number) => {
    setTags(tags.filter((_tag, index) => index !== i));
  };

  const handleAdditionTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      expire: "0",
      keywordFinish: "#SAIR",
      delayMessage: "1000",
      unknownMessage: "Mensagem não reconhecida",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: "0",
      ignoreJids: [],
      difyIdFallback: undefined,
    },
  });

  useEffect(() => {
    if (open) fetchData(instance, setSettings, setBots);
  }, [instance, open]);

  useEffect(() => {
    if (settings) {
      form.reset({
        expire: settings?.expire ? settings.expire.toString() : "0",
        keywordFinish: settings.keywordFinish,
        delayMessage: settings.delayMessage
          ? settings.delayMessage.toString()
          : "0",
        unknownMessage: settings.unknownMessage,
        listeningFromMe: settings.listeningFromMe,
        stopBotFromMe: settings.stopBotFromMe,
        keepOpen: settings.keepOpen,
        debounceTime: settings.debounceTime
          ? settings.debounceTime.toString()
          : "0",
        ignoreJids: settings.ignoreJids,
        difyIdFallback: settings.difyIdFallback,
      });
      setTags(
        settings.ignoreJids?.map((jid) => ({
          id: jid,
          text: jid,
          className: "",
        })) || [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const onSubmit = async () => {
    try {
      const data: z.infer<typeof FormSchema> = form.getValues();

      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      const settingsData: DifySettings = {
        expire: parseInt(data.expire),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime),
        difyIdFallback: data.difyIdFallback || undefined,
        ignoreJids: tags.map((tag) => tag.text),
      };

      await setDefaultSettingsDify(instance.name, instance.token, settingsData);
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
    fetchData(instance, setSettings, setBots);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Cog size={16} className="mr-1" /> Configurações Padrão
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
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <div className="space-y-4">
                <FormSelect
                  name="difyIdFallback"
                  label="Bot Fallback"
                  options={
                    bots
                      ?.filter((bot) => !!bot.id)
                      .map((bot) => ({
                        label: bot.id!,
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
                <FormInput name="debounceTime" label="Tempo de espera">
                  <Input type="number" />
                </FormInput>

                <FormField
                  control={form.control}
                  name="ignoreJids"
                  render={({ field }) => (
                    <div className="pb-4">
                      <label className="block text-sm font-medium">
                        Ignorar JIDs
                      </label>
                      <ReactTags
                        tags={tags}
                        handleDelete={handleDeleteTag}
                        handleAddition={handleAdditionTag}
                        inputFieldPosition="bottom"
                        placeholder="Adicionar JIDs ex: 1234567890@s.whatsapp.net"
                        autoFocus={false}
                        classNames={{
                          tags: "tagsClass",
                          tagInput: "tagInputClass",
                          tagInputField: "tagInputFieldClass",
                          selected: "selectedClass",
                          tag: "tagClass",
                          remove: "removeClass",
                          suggestions: "suggestionsClass",
                          activeSuggestion: "activeSuggestionClass",
                          editTagInput: "editTagInputClass",
                          editTagInputField: "editTagInputFieldClass",
                          clearAll: "clearAllClass",
                        }}
                      />
                      <input
                        type="hidden"
                        {...field}
                        value={tags.map((tag) => tag.text).join(",")}
                      />
                    </div>
                  )}
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

export { DefaultSettingsDify };
