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
import { Instance, Typebot, TypebotSettings } from "@/types/evolution.types";
import toastService from "@/utils/custom-toast.service";
import {
  findDefaultSettingsTypebot,
  findTypebot,
  setDefaultSettingsTypebot,
} from "@/services/typebot.service";
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
  typebotIdFallback: z.string().optional(),
});

const fetchData = async (
  instance: Instance | null,
  setSettings: any,
  setTypebots: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSettings: TypebotSettings[] = await findDefaultSettingsTypebot(
        instance.name,
        storedToken
      );

      setSettings(getSettings);

      const getTypebots: Typebot[] = await findTypebot(
        instance.name,
        storedToken
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

  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<TypebotSettings>();
  const [typebots, setTypebots] = useState<Typebot[]>([]);

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
      typebotIdFallback: undefined,
    },
  });

  useEffect(() => {
    fetchData(instance, setSettings, setTypebots);
  }, [instance]);

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
        typebotIdFallback: settings.typebotIdFallback,
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

      const settingsData: TypebotSettings = {
        expire: parseInt(data.expire),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime),
        typebotIdFallback: data.typebotIdFallback || undefined,
        ignoreJids: tags.map((tag) => tag.text),
      };

      await setDefaultSettingsTypebot(
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
    fetchData(instance, setSettings, setTypebots);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5">
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
                  name="typebotIdFallback"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Typebot Fallback</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border border-gray-600">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um typebot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-gray-600">
                          {typebots &&
                            typebots.length > 0 &&
                            Array.isArray(typebots) &&
                            typebots.map((typebot) => (
                              <SelectItem
                                key={typebot.id}
                                value={`${typebot.id}`}
                              >
                                {typebot.typebot}
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

export { DefaultSettingsTypebot };
