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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useInstance } from "@/contexts/InstanceContext";
import { createDify } from "@/services/dify.service";
import { Dify } from "@/types/evolution.types";
import toastService from "@/utils/custom-toast.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  botType: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
  triggerType: z.string(),
  triggerOperator: z.string().optional(),
  triggerValue: z.string().optional(),
  expire: z.string(),
  keywordFinish: z.string(),
  delayMessage: z.string(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.string(),
});

function NewDify({ resetTable }: { resetTable: () => void }) {
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      botType: "chatBot",
      apiUrl: "",
      apiKey: "",
      triggerType: "keyword",
      triggerOperator: "contains",
      triggerValue: "",
      expire: "0",
      keywordFinish: "",
      delayMessage: "0",
      unknownMessage: "",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: "0",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      setUpdating(true);
      const difyData: Dify = {
        enabled: data.enabled,
        description: data.description,
        botType: data.botType,
        apiUrl: data.apiUrl,
        apiKey: data.apiKey,
        triggerType: data.triggerType,
        triggerOperator: data.triggerOperator || "",
        triggerValue: data.triggerValue || "",
        expire: parseInt(data.expire, 10),
        keywordFinish: data.keywordFinish,
        delayMessage: parseInt(data.delayMessage, 10),
        unknownMessage: data.unknownMessage,
        listeningFromMe: data.listeningFromMe,
        stopBotFromMe: data.stopBotFromMe,
        keepOpen: data.keepOpen,
        debounceTime: parseInt(data.debounceTime, 10),
      };

      await createDify(instance.name, instance.token, difyData);
      toastService.success("Dify criado com sucesso!");
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar bot:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
      );
    } finally {
      setUpdating(false);
    }
  };

  function onReset() {
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5 text-white">
          <PlusIcon /> Dify
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[740px] sm:max-h-[600px] overflow-y-auto"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>Novo Dify</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start py-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="ml-4 space-y-0.5">
                        <FormLabel className="text-sm">Ativo</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Descrição</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Descrição"
                      />
                    </FormItem>
                  )}
                />
                <h3 className="mb-4 text-lg font-medium">Dify Settings</h3>
                <Separator className="border border-gray-700" />
                <FormField
                  control={form.control}
                  name="botType"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Tipo de Bot</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border border-gray-600">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma tipo de bot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-gray-600">
                          <SelectItem value="chatBot">Chat Bot</SelectItem>
                          <SelectItem value="textGenerator">
                            Gerador de texto
                          </SelectItem>
                          <SelectItem value="agent">Agente</SelectItem>
                          <SelectItem value="workflow">Workflow</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>URL da API</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="URL da API"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Chave da API</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Chave da API"
                        type="password"
                      />
                    </FormItem>
                  )}
                />
                <h3 className="mb-4 text-lg font-medium">Trigger Settings</h3>
                <Separator className="border border-gray-700" />
                <FormField
                  control={form.control}
                  name="triggerType"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Tipo de gatilho</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="border border-gray-600">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-gray-600">
                          <SelectItem value="keyword">Palavra Chave</SelectItem>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="none">Nenhum</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {form.watch("triggerType") === "keyword" && (
                  <>
                    <FormField
                      control={form.control}
                      name="triggerOperator"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Operador do gatilho</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="border border-gray-600">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um operador" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border border-gray-600">
                              <SelectItem value="contains">Contém</SelectItem>
                              <SelectItem value="equals">Igual à</SelectItem>
                              <SelectItem value="startsWith">
                                Começa com
                              </SelectItem>
                              <SelectItem value="endsWith">
                                Termina com
                              </SelectItem>
                              <SelectItem value="regex">Regex</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="triggerValue"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Gatilho</FormLabel>
                          <Input
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Gatilho"
                          />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <h3 className="mb-4 text-lg font-medium">Options Settings</h3>
                <Separator className="border border-gray-700" />
                <FormField
                  control={form.control}
                  name="expire"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Expira em (minutos)</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Expira em (minutos)"
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
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} variant="default" type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewDify };
