import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import "./style.css";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

function Openai() {
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <main className="main-table pt-5">
      <h3 className="ml-5 mb-1 text-lg font-medium">Openai Bots</h3>
      <Separator className="mt-4 border border-black" />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="p-5">
          <div className="table">
            <div className="table-item selected">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">clyryqkdy0001qfqdu1e8fiek</h3>
              <p className="table-item-description">chatCompletion</p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="border border-black" />
        <ResizablePanel>
          <div className="form">
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
                              <SelectItem value="clyrx36wj0001119ucjjzxik1">
                                sk-proj-ibN2xygUCGmLocVha4eUT3BlbkFJWZzRpH9bM6OhZ4eu8oZS
                              </SelectItem>
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
                              <SelectItem value="assistant">
                                Assistente
                              </SelectItem>
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
                              <SelectItem value="keyword">
                                Palavra Chave
                              </SelectItem>
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
                              <SelectItem value="startsWith">
                                Começa com
                              </SelectItem>
                              <SelectItem value="endsWith">
                                Termina com
                              </SelectItem>
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
                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

export { Openai };
