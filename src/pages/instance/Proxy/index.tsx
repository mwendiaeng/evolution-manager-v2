/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">Proxy</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:p-4">
              <FormSwitch
                name="enabled"
                label="Ativo"
                className="w-full justify-between"
                helper="Ativa ou desativa o proxy"
              />
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr_10rem] md:gap-8">
                <FormInput name="protocol" label="Protocolo">
                  <Input />
                </FormInput>
                <FormInput name="host" label="Host">
                  <Input />
                </FormInput>
                <FormInput name="port" label="Porta">
                  <Input type="number" />
                </FormInput>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <FormInput name="username" label="Usuário">
                  <Input />
                </FormInput>
                <FormInput name="password" label="Senha">
                  <Input type="password" />
                </FormInput>
              </div>
              <div className="flex justify-end px-4 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Proxy };
