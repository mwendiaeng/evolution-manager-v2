import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
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
import { FormInput, FormSelect } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createInstance } from "@/services/instances.service";

import { NewInstance as NewInstanceType } from "@/types/evolution.types";

import { LoginFacebookButton } from "./LoginFacebookButton";
import { LoginInstagramButton } from "./LoginInstagramButton";
import { LoginWhatsappButton } from "./LoginWhatsappButton";

const stringOrNullSchema = z
  .union([z.string(), z.null()])
  .transform((value) => (value === "" ? null : value));

const FormSchema = z.object({
  name: z.string(),
  token: stringOrNullSchema,
  number: stringOrNullSchema,
  businessId: stringOrNullSchema,
  integration: z.enum([
    "WHATSAPP-BUSINESS",
    "WHATSAPP-BAILEYS",
    "META-FACEBOOK",
    "META-INSTAGRAM",
  ]),
});

function NewInstance({ resetTable }: { resetTable: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      integration: "WHATSAPP-BAILEYS",
      token: uuidv4().replace("-", "").toUpperCase(),
      number: "",
      businessId: "",
    },
  });

  const integrationSelected = form.watch("integration");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const instanceData: NewInstanceType = {
        instanceName: data.name,
        integration: data.integration,
        token: data.token === "" ? null : data.token,
        number: data.number === "" ? null : data.number,
        businessId: data.businessId === "" ? null : data.businessId,
      };

      await createInstance(instanceData);

      toast.success("Instância criada com sucesso");
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar instância:", error);
      toast.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`,
      );
    }
  };

  const onReset = () => {
    form.reset({
      name: "",
      integration: "WHATSAPP-BAILEYS",
      token: uuidv4().replace("-", "").toLocaleUpperCase(),
      number: "",
      businessId: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Instância <PlusIcon size="18" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]" onCloseAutoFocus={onReset}>
        <DialogHeader>
          <DialogTitle>Nova Instância</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormInput required name="name" label="Nome">
              <Input />
            </FormInput>
            <FormSelect
              name="integration"
              label="Integração"
              options={[
                { value: "WHATSAPP-BAILEYS", label: "Baileys" },
                { value: "WHATSAPP-BUSINESS", label: "Whatsapp Cloud API" },
                { value: "META-FACEBOOK", label: "Facebook" },
                { value: "META-INSTAGRAM", label: "Instagram" },
              ]}
            />
            <FormInput required name="token" label="Token">
              <Input />
            </FormInput>
            <FormInput name="number" label="Número">
              <Input type="tel" />
            </FormInput>
            {integrationSelected === "WHATSAPP-BUSINESS" && (
              <FormInput required name="businessId" label="Business ID">
                <Input />
              </FormInput>
            )}
            <DialogFooter>
              {integrationSelected === "WHATSAPP-BUSINESS" && (
                <LoginWhatsappButton
                  setNumber={(number) => form.setValue("number", number)}
                  setBusiness={(businessId) =>
                    form.setValue("businessId", businessId)
                  }
                  setToken={(token) => form.setValue("token", token)}
                />
              )}
              {integrationSelected === "META-FACEBOOK" && (
                <LoginFacebookButton
                  setUserID={(userID) => form.setValue("number", userID)}
                  setToken={(token) => form.setValue("token", token)}
                />
              )}
              {integrationSelected === "META-INSTAGRAM" && (
                <LoginInstagramButton
                  setUserID={(userID) => form.setValue("number", userID)}
                  setToken={(token) => form.setValue("token", token)}
                />
              )}
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewInstance };
