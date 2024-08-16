/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useInstance } from "@/contexts/InstanceContext";

import { createProxy, fetchProxy } from "@/services/proxy.service";

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
      toast.success("Proxy criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar proxy:", error);
      toast.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`,
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
                    className="w-full border border-gray-600"
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
                    className="w-full border border-gray-600"
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
                    className="w-full border border-gray-600"
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
                    className="w-full border border-gray-600"
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
                    className="w-full border border-gray-600"
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
