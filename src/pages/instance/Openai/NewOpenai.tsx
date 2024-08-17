/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
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
import { FormInput, FormSelect, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useInstance } from "@/contexts/InstanceContext";

import {
  createOpenai,
  findOpenaiCreds,
  getModels,
} from "@/services/openai.service";

import { ModelOpenai, OpenaiBot, OpenaiCreds } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  openaiCredsId: z.string(),
  botType: z.string(),
  assistantId: z.string(),
  functionUrl: z.string(),
  model: z.string(),
  systemMessages: z.string(),
  assistantMessages: z.string(),
  userMessages: z.string(),
  maxTokens: z.string(),
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

function NewOpenai({ resetTable }: { resetTable: () => void }) {
  const { instance } = useInstance();

  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<ModelOpenai[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      description: "",
      openaiCredsId: "",
      botType: "assistant",
      assistantId: "",
      functionUrl: "",
      model: "gpt-3.5-turbo",
      systemMessages: "",
      assistantMessages: "",
      userMessages: "",
      maxTokens: "300",
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

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          if (!instance) return;
          const response = await getModels(instance.name, instance.token);

          setModels(response);

          const getCreds: OpenaiCreds[] = await findOpenaiCreds(
            instance.name,
            instance.token,
          );

          setCreds(getCreds);
        } catch (error) {
          console.error("Erro ao buscar modelos:", error);
        }
      };

      fetchData();
    }
  }, [instance, open]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      setUpdating(true);
      const openaiData: OpenaiBot = {
        enabled: data.enabled,
        description: data.description,
        openaiCredsId: data.openaiCredsId,
        botType: data.botType,
        assistantId: data.assistantId,
        functionUrl: data.functionUrl,
        model: data.model,
        systemMessages: [data.systemMessages],
        assistantMessages: [data.assistantMessages],
        userMessages: [data.userMessages],
        maxTokens: parseInt(data.maxTokens, 10),
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

      await createOpenai(instance.name, instance.token, openaiData);
      toast.success("Bot criado com sucesso!");
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar bot:", error);
      toast.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`,
      );
    } finally {
      setUpdating(false);
    }
  };

  function onReset() {
    form.reset();
  }

  const botType = form.watch("botType");
  const triggerType = form.watch("triggerType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">Openai Bot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl" onCloseAutoFocus={onReset}>
        <DialogHeader>
          <DialogTitle>Novo Openai Bot</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="space-y-4">
                <FormSwitch name="enabled" label="Ativo" reverse />
                <FormInput name="description" label="Descrição" required>
                  <Input />
                </FormInput>
                <FormSelect
                  name="openaiCredsId"
                  label="Credencial"
                  required
                  options={creds
                    .filter((cred) => !!cred.id)
                    .map((cred) => ({
                      label: cred.name
                        ? cred.name
                        : cred.apiKey.substring(0, 15) + "...",
                      value: cred.id!,
                    }))}
                />
                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">Openai Settings</h3>
                  <Separator />
                </div>
                <FormSelect
                  name="botType"
                  label="Tipo de Bot"
                  required
                  options={[
                    { label: "Assistente", value: "assistant" },
                    { label: "Chat Completion", value: "chatCompletion" },
                  ]}
                />
                {botType === "assistant" && (
                  <>
                    <FormInput
                      name="assistantId"
                      label="ID do Assistente"
                      required
                    >
                      <Input />
                    </FormInput>
                    <FormInput
                      name="functionUrl"
                      label="URL das Funções"
                      required
                    >
                      <Input />
                    </FormInput>
                  </>
                )}
                {botType === "chatCompletion" && (
                  <>
                    <FormSelect
                      name="model"
                      label="Modelo de Linguagem"
                      required
                      options={models.map((model) => ({
                        label: model.id,
                        value: model.id,
                      }))}
                    />
                    <FormInput
                      name="systemMessages"
                      label="Mensagem do Sistema"
                    >
                      <Textarea />
                    </FormInput>
                    <FormInput
                      name="assistantMessages"
                      label="Mensagem do Assistente"
                    >
                      <Textarea />
                    </FormInput>
                    <FormInput name="userMessages" label="Mensagem do Usuário">
                      <Textarea />
                    </FormInput>

                    <FormInput name="maxTokens" label="Máximo de Tokens">
                      <Input type="number" />
                    </FormInput>
                  </>
                )}

                <div className="flex flex-col">
                  <h3 className="my-4 text-lg font-medium">Trigger Settings</h3>
                  <Separator />
                </div>
                <FormSelect
                  name="triggerType"
                  label="Tipo de Gatilho"
                  required
                  options={[
                    { label: "Palavra Chave", value: "keyword" },
                    { label: "Todos", value: "all" },
                    { label: "Avançado", value: "advanced" },
                    { label: "Nenhum", value: "none" },
                  ]}
                />
                {triggerType === "keyword" && (
                  <>
                    <FormSelect
                      name="triggerOperator"
                      label="Operador do Gatilho"
                      required
                      options={[
                        { label: "Contém", value: "contains" },
                        { label: "Igual à", value: "equals" },
                        { label: "Começa com", value: "startsWith" },
                        { label: "Termina com", value: "endsWith" },
                        { label: "Regex", value: "regex" },
                      ]}
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
              </div>
            </div>
            <DialogFooter>
              <Button disabled={updating} type="submit">
                {updating ? "Salvando…" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewOpenai };
