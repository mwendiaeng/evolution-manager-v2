import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
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

import { useInstance } from "@/contexts/InstanceContext";

import { createDify } from "@/services/dify.service";

import { Dify } from "@/types/evolution.types";

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
      toast.success("Dify criado com sucesso!");
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

  const triggerType = form.watch("triggerType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon size={16} className="mr-1" />
          <span className="hidden sm:inline">Dify</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
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
                <FormSwitch name="enabled" label="Ativo" reverse />
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
            <DialogFooter>
              <Button disabled={updating} type="submit">
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
