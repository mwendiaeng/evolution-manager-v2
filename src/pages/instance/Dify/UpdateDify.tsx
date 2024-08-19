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
import { Form, FormInput, FormSelect, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";

import { deleteDify, getDify, updateDify } from "@/services/dify.service";

import { Dify, Instance } from "@/types/evolution.types";

import { SessionsDify } from "./SessionsDify";

const formSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  botType: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
  triggerType: z.string(),
  triggerOperator: z.string().optional(),
  triggerValue: z.string().optional(),
  expire: z.coerce.number(),
  keywordFinish: z.string(),
  delayMessage: z.coerce.number(),
  unknownMessage: z.string(),
  listeningFromMe: z.boolean(),
  stopBotFromMe: z.boolean(),
  keepOpen: z.boolean(),
  debounceTime: z.coerce.number(),
});
type FormSchema = z.infer<typeof formSchema>;

type UpdateDifyProps = {
  difyId: string;
  instance: Instance | null;
  resetTable: () => void;
};

function UpdateDify({ difyId, instance, resetTable }: UpdateDifyProps) {
  const [, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      description: "",
      botType: "chatBot",
      apiUrl: "",
      apiKey: "",
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
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken && instance && instance.name && difyId) {
          setToken(storedToken);

          const data: Dify = await getDify(instance.name, storedToken, difyId);

          form.reset({
            enabled: data.enabled,
            description: data.description,
            botType: data.botType,
            apiUrl: data.apiUrl,
            apiKey: data.apiKey,
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
  }, [form, instance, difyId]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && difyId) {
        const difyData: Dify = {
          enabled: data.enabled,
          description: data.description,
          botType: data.botType,
          apiUrl: data.apiUrl,
          apiKey: data.apiKey,
          triggerType: data.triggerType,
          triggerOperator: data.triggerOperator || "",
          triggerValue: data.triggerValue || "",
          expire: data.expire,
          keywordFinish: data.keywordFinish,
          delayMessage: data.delayMessage,
          unknownMessage: data.unknownMessage,
          listeningFromMe: data.listeningFromMe,
          stopBotFromMe: data.stopBotFromMe,
          keepOpen: data.keepOpen,
          debounceTime: data.debounceTime,
        };

        await updateDify(instance.name, storedToken, difyId, difyData);
        toast.success("Dify atualizado com sucesso.");
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao atualizar bot:", error);
      toast.error(
        `Erro ao atualizar : ${error?.response?.data?.response?.message}`,
      );
    }
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && instance && instance.name && difyId) {
        await deleteDify(instance.name, storedToken, difyId);
        toast.success("Dify excluído com sucesso.");

        setOpenDeletionDialog(false);
        resetTable();
        navigate(`/manager/instance/${instance.id}/dify`);
      } else {
        console.error("Token ou nome da instância não encontrados.");
      }
    } catch (error) {
      console.error("Erro ao excluir dify:", error);
    }
  };

  const botDescription = form.watch("description");
  const triggerType = form.watch("triggerType");

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 pl-4 pr-2"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="mb-4 text-lg font-medium">
                  Dify: {botDescription}
                </h3>
                <FormSwitch
                  name="enabled"
                  className="flex items-center gap-3"
                />
              </div>
              <div className="space-y-4">
                <FormInput name="description" label="Descrição" required>
                  <Input />
                </FormInput>

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">Dify Settings</h3>
                  <Separator />
                </div>
                <FormSelect
                  name="botType"
                  label="Tipo de Bot"
                  required
                  options={[
                    { label: "Chat Bot", value: "chatBot" },
                    { label: "Gerador de texto", value: "textGenerator" },
                    { label: "Agente", value: "agent" },
                    { label: "Workflow", value: "workflow" },
                  ]}
                />
                <FormInput name="apiUrl" label="URL da API">
                  <Input />
                </FormInput>
                <FormInput name="apiKey" label="Chave da API">
                  <Input type="password" />
                </FormInput>
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">Trigger Settings</h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label="Tipo de Gatilho"
                  options={[
                    { label: "Palavra Chave", value: "keyword" },
                    { label: "Todos", value: "all" },
                    { label: "Avançado", value: "advanced" },
                    { label: "Nenhum", value: "none" },
                  ]}
                  required
                />
                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label="Operador do Gatilho"
                      options={[
                        { label: "Contém", value: "contains" },
                        { label: "Igual à", value: "equals" },
                        { label: "Começa com", value: "startsWith" },
                        { label: "Termina com", value: "endsWith" },
                        { label: "Regex", value: "regex" },
                      ]}
                      required
                    />
                    <FormInput name="triggerValue" label="Gatilho" required>
                      <Input />
                    </FormInput>
                  </>
                )}
                {triggerType === "advanced" && (
                  <FormInput name="triggerValue" label="Condições" required>
                    <Input />
                  </FormInput>
                )}
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">Options Settings</h3>
                  <Separator />
                </div>
                <FormInput name="expire" label="Expira em (minutos)" required>
                  <Input type="number" />
                </FormInput>
                <FormInput
                  name="keywordFinish"
                  label="Palavra Chave de Finalização"
                  required
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
                <FormInput name="debounceTime" label="Tempo de espera" required>
                  <Input type="number" />
                </FormInput>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <SessionsDify difyId={difyId} />
              <div className="flex items-center gap-3">
                <Dialog
                  open={openDeletionDialog}
                  onOpenChange={setOpenDeletionDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
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
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenDeletionDialog(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Excluir
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button type="submit">Atualizar</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}

export { UpdateDify };
