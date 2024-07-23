import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instance, OpenaiBot, OpenaiCreds } from "@/types/evolution.types";
import { useEffect, useState } from "react";
import {
  deleteOpenai,
  getOpenai,
  updateOpenai,
} from "@/services/openai.service";
import toastService from "@/utils/custom-toast.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const FormSchema = z.object({
  enabled: z.boolean(),
  openaiCredsId: z.string(),
  botType: z.string(),
  assistantId: z.string(),
  model: z.string(),
  systemMessages: z.string(),
  assistantMessages: z.string(),
  userMessages: z.string(),
  maxTokens: z.number(),
  triggerType: z.string(),
  triggerOperator: z.string(),
  triggerValue: z.string(),
  expire: z.number(),
  keywordFinish: z.string(),
  delayMessage: z.number(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.number(),
  ignoreJids: z.array(z.string()),
});

type UpdateOpenaiProps = {
  openaiBotId: string;
  instance: Instance | null;
  creds: OpenaiCreds[];
  resetTable: () => void;
};

function UpdateOpenai({
  openaiBotId,
  instance,
  creds,
  resetTable,
}: UpdateOpenaiProps) {
  const [, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      openaiCredsId: "",
      botType: "assistant",
      assistantId: "",
      model: "gpt-3.5-turbo",
      systemMessages: "",
      assistantMessages: "",
      userMessages: "",
      maxTokens: 300,
      triggerType: "keyword",
      triggerOperator: "contains",
      triggerValue: "",
      expire: 0,
      keywordFinish: "",
      delayMessage: 0,
      unknownMessage: "",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: 0,
      ignoreJids: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instance && instance.name && openaiBotId) {
          setToken(storedToken);

          const data: OpenaiBot = await getOpenai(
            instance.name,
            storedToken,
            openaiBotId
          );

          form.reset({
            enabled: data.enabled,
            openaiCredsId: data.openaiCredsId,
            botType: data.botType,
            assistantId: data.assistantId,
            model: data.model,
            systemMessages: data.systemMessages,
            assistantMessages: data.assistantMessages,
            userMessages: data.userMessages,
            maxTokens: data.maxTokens,
            triggerType: data.triggerType,
            triggerOperator: data.triggerOperator,
            triggerValue: data.triggerValue,
            expire: data.expire,
            keywordFinish: data.keywordFinish,
            delayMessage: data.delayMessage,
            unknownMessage: data.unknownMessage,
            listeningFromMe: data.listeningFromMe,
            stopBotFromMe: data.stopBotFromMe,
            keepOpen: data.keepOpen,
            debounceTime: data.debounceTime,
            ignoreJids: data.ignoreJids,
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
  }, [form, instance, openaiBotId]);

  const onSubmit = async () => {
    try {
      const data: z.infer<typeof FormSchema> = form.getValues();

      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && openaiBotId) {
        const openaiBotData: OpenaiBot = {
          enabled: data.enabled,
          openaiCredsId: data.openaiCredsId,
          botType: data.botType,
          assistantId: data.assistantId,
          model: data.model,
          systemMessages: data.systemMessages,
          assistantMessages: data.assistantMessages,
          userMessages: data.userMessages,
          maxTokens: data.maxTokens,
          triggerType: data.triggerType,
          triggerOperator: data.triggerOperator,
          triggerValue: data.triggerValue,
          expire: data.expire,
          keywordFinish: data.keywordFinish,
          delayMessage: data.delayMessage,
          unknownMessage: data.unknownMessage,
          listeningFromMe: data.listeningFromMe,
          stopBotFromMe: data.stopBotFromMe,
          keepOpen: data.keepOpen,
          debounceTime: data.debounceTime,
          ignoreJids: data.ignoreJids,
        };

        await updateOpenai(
          instance.name,
          storedToken,
          openaiBotId,
          openaiBotData
        );
        toastService.success("Bot atualizado com sucesso.");
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao atualizar bot:", error);
      toastService.error(
        `Erro ao atualizar : ${error?.response?.data?.response?.message}`
      );
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && openaiBotId) {
        await deleteOpenai(instance.name, storedToken, openaiBotId);
        toastService.success("Bot excluído com sucesso.");

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/instance/${instance.id}/openai`);
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
    } catch (error) {
      console.error("Erro ao excluir bot:", error);
    }
  };

  return (
    <div className="form">
      {loading && <LoadingSpinner />}
      {!loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <h3 className="mb-4 text-lg font-medium">Openai</h3>
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
                          {creds.map((cred) => (
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
                <h3 className="mb-4 text-lg font-medium">Openai Settings</h3>
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
                          <SelectItem value="assistant">Assistente</SelectItem>
                          <SelectItem value="chatCompletion">
                            Chat Completion
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {form.watch("botType") === "assistant" && (
                  <FormField
                    control={form.control}
                    name="assistantId"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel>ID do Assistente</FormLabel>
                        <Input
                          {...field}
                          className="border border-gray-600 w-full"
                          placeholder="ID do Assistente"
                        />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("botType") === "chatCompletion" && (
                  <>
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Modelo de Linguagem</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="border border-gray-600">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um modelo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border border-gray-600">
                              <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">
                                gpt-3.5-turbo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="systemMessages"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Mensagem do Sistem</FormLabel>
                          <Textarea
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Mensagem do Sistem"
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assistantMessages"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Mensagem do Asistente</FormLabel>
                          <Textarea
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Mensagem do Asistente"
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userMessages"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Mensagem do Usuário</FormLabel>
                          <Textarea
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Mensagem do Usuário"
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxTokens"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Máximo de tokens</FormLabel>
                          <Input
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Máximo de tokens"
                            type="number"
                          />
                        </FormItem>
                      )}
                    />
                  </>
                )}
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
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
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
                          <SelectItem value="startsWith">Começa com</SelectItem>
                          <SelectItem value="endsWith">Termina com</SelectItem>
                          <SelectItem value="regex">Regex</SelectItem>
                          <SelectItem value="none">Nenhum</SelectItem>
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
                <h3 className="mb-4 text-lg font-medium">Options Settings</h3>
                <Separator className="border border-gray-700" />
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
                          Para o bot quando eu enviar uma mensagem
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
            <Button
              className="bg-blue-400 hover:bg-blue-600 text-white"
              onClick={onSubmit}
            >
              Atualizar
            </Button>
            <Dialog
              open={openDeletionDialog}
              onOpenChange={setOpenDeletionDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="ml-2 bg-red-400 hover:bg-red-600"
                >
                  Excluir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tem certeza que deseja excluir?</DialogTitle>
                  <DialogDescription>
                    Esta ação não pode ser desfeita.
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      variant="default"
                      className="bg-red-400 hover:bg-red-600 text-white"
                      onClick={handleDelete}
                    >
                      Exluir
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDeletionDialog(false)}
                    >
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      )}
    </div>
  );
}

export { UpdateOpenai };
