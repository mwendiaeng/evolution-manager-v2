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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toastService from "@/utils/custom-toast.service";

const FormSchema = z.object({
  enabled: z.boolean(),
  url: z.string().url(),
  typebot: z.string(),
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
});

function Typebot() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: true,
      url: "",
      typebot: "",
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toastService.success("You submitted");
    console.log(data);
  }

  return (
    <main className="main-table pt-5">
      <h3 className="ml-5 mb-1 text-lg font-medium">Typebots</h3>
      <Separator className="mt-4 border border-black" />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="p-5">
          <div className="table">
            <div className="table-item selected">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
            </div>
            <div className="table-item">
              <h3 className="table-item-title">
                https://api.typebot.evolution-api.com
              </h3>
              <p className="table-item-description">fallback-2gidc8u</p>
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
                    <h3 className="mb-4 text-lg font-medium">
                      Typebot Settings
                    </h3>
                    <Separator className="border border-gray-700" />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem className="pb-4">
                          <FormLabel>Url da API do Typebot</FormLabel>
                          <Input
                            {...field}
                            className="border border-gray-600 w-full"
                            placeholder="Url da API do Typebot"
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
                            className="border border-gray-600 w-full"
                            placeholder="Nome do Typebot"
                          />
                        </FormItem>
                      )}
                    />
                    <h3 className="mb-4 text-lg font-medium">
                      Trigger Settings
                    </h3>
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
                    <h3 className="mb-4 text-lg font-medium">
                      Options Settings
                    </h3>
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

export { Typebot };
