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
                  Typebot: {botDescription}
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
                  <h3 className="my-4 text-lg font-medium">Typebot Settings</h3>
                  <Separator />
                </div>
                <FormInput name="url" label="URL da API do Typebot" required>
                  <Input />
                </FormInput>
                <FormInput name="typebot" label="Nome do Typebot" required>
                  <Input />
                </FormInput>

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

            <div className="flex items-center justify-between">
              <SessionsTypebot typebotId={typebotId} />
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
                          Exluir
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

export { UpdateTypebot };
