import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import {
  deleteTypebot,
  getTypebot,
  updateTypebot,
} from "@/services/typebot.service";

import { Instance, Typebot } from "@/types/evolution.types";

import { SessionsTypebot } from "./SessionsTypebot";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  url: z.string().url(),
  typebot: z.string(),
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
  ignoreJids: z.array(z.string()),
});

type UpdateTypebotProps = {
  typebotId: string;
  instance: Instance | null;
  resetTable: () => void;
};

function UpdateTypebot({
  typebotId,
  instance,
  resetTable,
}: UpdateTypebotProps) {
  const [, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      url: "",
      typebot: "",
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
      ignoreJids: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instance && instance.name && typebotId) {
          setToken(storedToken);

          const data: Typebot = await getTypebot(
            instance.name,
            storedToken,
            typebotId,
          );

          form.reset({
            enabled: data.enabled,
            description: data.description,
            url: data.url,
            typebot: data.typebot,
            triggerType: data.triggerType,
            triggerOperator: data.triggerOperator,
            triggerValue: data.triggerValue,
            expire: data.expire.toString(),
            keywordFinish: data.keywordFinish,
            delayMessage: data.delayMessage.toString(),
            unknownMessage: data.unknownMessage,
            listeningFromMe: data.listeningFromMe,
            stopBotFromMe: data.stopBotFromMe,
            keepOpen: data.keepOpen,
            debounceTime: data.debounceTime.toString(),
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
  }, [form, instance, typebotId]);

  const onSubmit = async () => {
    try {
      const data: z.infer<typeof FormSchema> = form.getValues();

      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && typebotId) {
        const typebotData: Typebot = {
          enabled: data.enabled,
          description: data.description,
          url: data.url,
          typebot: data.typebot,
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

        await updateTypebot(instance.name, storedToken, typebotId, typebotData);
        toast.success("Typebot atualizado com sucesso.");
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao atualizar typebot:", error);
      toast.error(
        `Erro ao atualizar : ${error?.response?.data?.response?.message}`,
      );
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && typebotId) {
        await deleteTypebot(instance.name, storedToken, typebotId);
        toast.success("Typebot excluído com sucesso.");

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/typebot`);
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
    } catch (error) {
      console.error("Erro ao excluir typebot:", error);
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
              <h3 className="mb-4 text-lg font-medium">Typebot</h3>
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
                        className="w-full border border-gray-600"
                        placeholder="Descrição"
                      />
                    </FormItem>
                  )}
                />
                <h3 className="mb-4 text-lg font-medium">Typebot Settings</h3>
                <Separator className="border border-gray-700" />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>URL da API do Typebot</FormLabel>
                      <Input
                        {...field}
                        className="w-full border border-gray-600"
                        placeholder="URL da API do Typebot"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typebot"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Nome do Typebot</FormLabel>
                      <Input
                        {...field}
                        className="w-full border border-gray-600"
                        placeholder="Nome do Typebot"
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
                            className="w-full border border-gray-600"
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
                        className="w-full border border-gray-600"
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
                        className="w-full border border-gray-600"
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
                        className="w-full border border-gray-600"
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
                        className="w-full border border-gray-600"
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
                        className="w-full border border-gray-600"
                        placeholder="Tempo de espera"
                        type="number"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <SessionsTypebot typebotId={typebotId} />
            </div>
            <Button
              className="bg-blue-400 text-white hover:bg-blue-600"
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
                      className="bg-red-400 text-white hover:bg-red-600"
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

export { UpdateTypebot };
