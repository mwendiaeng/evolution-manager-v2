/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useInstance } from "@/contexts/InstanceContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cog } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {
  Instance,
  OpenaiBot,
  OpenaiCreds,
  OpenaiSettings,
} from "@/types/evolution.types";
import toastService from "@/utils/custom-toast.service";
import { Switch } from "@/components/ui/switch";
import { WithContext as ReactTags } from "react-tag-input";
import { Tag } from "node_modules/react-tag-input/types/components/SingleTag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  findDefaultSettingsOpenai,
  findOpenai,
  findOpenaiCreds,
  setDefaultSettingsOpenai,
} from "@/services/openai.service";

const FormSchema = z.object({
  openaiCredsId: z.string(),
  expire: z.string(),
  keywordFinish: z.string(),
  delayMessage: z.string(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.string(),
  speechToText: z.boolean(),
  ignoreJids: z.array(z.string()),
  openaiIdFallback: z.string().optional(),
});

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setBots: any,
  setCreds: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSettings: OpenaiSettings[] = await findDefaultSettingsOpenai(
        instance.name,
        storedToken
      );

      setSettings(getSettings);

      const getBots: OpenaiBot[] = await findOpenai(instance.name, storedToken);

      setBots(getBots);

      const getCreds: OpenaiCreds[] = await findOpenaiCreds(
        instance.name,
        storedToken
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
  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<OpenaiSettings>();
  const [bots, setBots] = useState<OpenaiBot[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[]>();

  const handleDeleteTag = (i: number) => {
    setTags(tags.filter((_tag, index) => index !== i));
  };

  const handleAdditionTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      openaiCredsId: "",
      expire: "0",
      keywordFinish: "#SAIR",
      delayMessage: "1000",
      unknownMessage: "Mensagem não reconhecida",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: "0",
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
        speechToText: settings.speechToText,
        ignoreJids: settings.ignoreJids,
        openaiIdFallback: settings.openaiIdFallback,
      });
      setTags(
        settings.ignoreJids?.map((jid) => ({
          id: jid,
          text: jid,
          className: "",
        })) || []
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

      const settingsData: OpenaiSettings = {
        openaiCredsId: data.openaiCredsId,
        expire: parseInt(data.expire),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime),
        speechToText: data.speechToText,
        openaiIdFallback: data.openaiIdFallback || undefined,
        ignoreJids: tags.map((tag) => tag.text),
      };

      await setDefaultSettingsOpenai(
        instance.name,
        instance.token,
        settingsData
      );
      toastService.success("Configuração salva com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar bot:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
      );
    }
  };

  function onReset() {
    fetchData(instance, setSettings, setBots, setCreds);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5 text-white">
          <Cog /> Configurações Padrão
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[740px] sm:max-h-[600px] overflow-y-auto"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>Configurações Padrão</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="w-full space-y-6">
            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="openaiCredsId"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Credencial</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border border-gray-600">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma credencial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-gray-600">
                          {creds &&
                            creds.length > 0 &&
                            Array.isArray(creds) &&
                            creds.map((cred) => (
                              <SelectItem key={cred.id} value={`${cred.id}`}>
                                {cred.name
                                  ? cred.name
                                  : cred.apiKey.substring(0, 15) + "..."}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openaiIdFallback"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Bot Fallback</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border border-gray-600">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um bot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-gray-600">
                          {bots &&
                            bots.length > 0 &&
                            Array.isArray(bots) &&
                            bots.map((bot) => (
                              <SelectItem key={bot.id} value={`${bot.id}`}>
                                {bot.id}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expire"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Expira em (minitos)</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Expira em (minitos)"
                        type="number"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywordFinish"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Palavra Chave de Finalização</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Palavra Chave de Finalização"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delayMessage"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Delay padrão da mensagem</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Delay padrão da mensagem"
                        type="number"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unknownMessage"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>
                        Mensagem para tipo de mensagem desconhecida
                      </FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Mensagem para tipo de mensagem desconhecida"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listeningFromMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start py-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="ml-4 space-y-0.5">
                        <FormLabel className="text-sm">
                          Escuta mensagens enviadas por mim
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stopBotFromMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start py-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="ml-4 space-y-0.5">
                        <FormLabel className="text-sm">
                          Pausa o bot quando eu enviar uma mensagem
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keepOpen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start py-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="ml-4 space-y-0.5">
                        <FormLabel className="text-sm">
                          Mantem a sessão do bot aberta
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speechToText"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start py-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="ml-4 space-y-0.5">
                        <FormLabel className="text-sm">
                          Converter áudio em texto
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="debounceTime"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Tempo de espera</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Tempo de espera"
                        type="number"
                      />
                    </FormItem>
                  )}
                />
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
              <Button variant="default" type="button" onClick={onSubmit}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { DefaultSettingsOpenai };
