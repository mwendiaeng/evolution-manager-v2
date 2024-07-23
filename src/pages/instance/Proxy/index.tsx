/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { createProxy, fetchProxy } from "@/services/proxy.service";
import { useInstance } from "@/contexts/InstanceContext";
import toastService from "@/utils/custom-toast.service";
import { Proxy as ProxyType } from "@/types/evolution.types";

const FormSchema = z.object({
  enabled: z.boolean(),
  host: z.string(),
  port: z.string(),
  protocol: z.string(),
  username: z.string(),
  password: z.string(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

function Proxy() {
  const { instance } = useInstance();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: false,
      host: "",
      port: "",
      protocol: "http",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const loadProxyData = async () => {
      if (!instance) return;
      setLoading(true);
      try {
        const data = await fetchProxy(instance.name, instance.token);
        form.reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do proxy:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProxyData();
  }, [instance, form]);

  const onSubmit = async () => {
    if (!instance) return;

    const data = form.getValues();

    console.log("data", data);
    setLoading(true);
    try {
      const proxyData: ProxyType = {
        enabled: data.enabled,
        host: data.host,
        port: data.port,
        protocol: data.protocol,
        username: data.username,
        password: data.password,
      };

      await createProxy(instance.name, instance.token, proxyData);
      toastService.success("Proxy criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar proxy:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <Form {...form}>
        <form className="w-full space-y-6">
          <div>
            <h3 className="mb-1 text-lg font-medium">Proxy</h3>
            <Separator className="my-4 border-t border-gray-600" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Ativo</FormLabel>
                      <FormDescription>
                        Ativa ou desativa o proxy
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="Host"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="Porta"
                    type="number"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="Protocolo"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="Usuário"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border border-gray-600 w-full"
                    placeholder="Senha"
                    type="password"
                  />
                )}
              />
            </div>
          </div>
          <Button disabled={loading} onClick={onSubmit}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

export { Proxy };
