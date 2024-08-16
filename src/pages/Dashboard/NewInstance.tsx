import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInstance } from "@/services/instances.service";
import { NewInstance as NewInstanceType } from "@/types/evolution.types";
import toastService from "@/utils/custom-toast.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { LoginWhatsappButton } from "./LoginWhatsappButton";
import { v4 as uuidv4 } from "uuid";
import { LoginFacebookButton } from "./LoginFacebookButton";

const FormSchema = z.object({
  name: z.string(),
  integration: z.string(),
  token: z.string(),
  number: z.string(),
  businessId: z.string(),
});

function NewInstance({ resetTable }: { resetTable: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      integration: "WHATSAPP-BAILEYS",
      token: uuidv4().replace("-", "").toLocaleUpperCase(),
      number: "",
      businessId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const instanceData: NewInstanceType = {
        instanceName: data.name,
        integration: data.integration,
        token: data.token === "" ? undefined : data.token,
        number: data.number === "" ? undefined : data.number,
        businessId: data.businessId === "" ? undefined : data.businessId,
      };

      await createInstance(instanceData);

      toastService.success("Instância criada com sucesso");
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar instância:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
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
        <Button variant="default">
          <PlusIcon /> Instância
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                className="col-span-3 border border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="integration" className="text-right">
                Integração
              </Label>
              <FormField
                control={form.control}
                name="integration"
                render={({ field }) => (
                  <FormItem className="col-span-3 w-full border border-gray-600">
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
                        <SelectItem value="WHATSAPP-BAILEYS">
                          Baileys
                        </SelectItem>
                        <SelectItem value="WHATSAPP-BUSINESS">
                          Whatsapp Cloud API
                        </SelectItem>
                        <SelectItem value="META">
                          Facebook / Instagram
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="token" className="text-right">
                Token
              </Label>
              <Input
                id="token"
                {...form.register("token")}
                className="col-span-3 border border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Número
              </Label>
              <Input
                id="number"
                {...form.register("number")}
                className="col-span-3 border border-gray-600"
              />
            </div>
            {form.watch("integration") === "WHATSAPP-BUSINESS" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessId" className="text-right">
                  Business ID
                </Label>
                <Input
                  id="businessId"
                  {...form.register("businessId")}
                  className="col-span-3 border border-gray-600"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Salvar</Button>
              {form.watch("integration") === "WHATSAPP-BUSINESS" && (
                <LoginWhatsappButton
                  setNumber={(number) => form.setValue("number", number)}
                  setBusiness={(businessId) =>
                    form.setValue("businessId", businessId)
                  }
                  setToken={(token) => form.setValue("token", token)}
                />
              )}
              {form.watch("integration") === "META" && (
                <LoginFacebookButton
                  setUserID={(userID) => form.setValue("number", userID)}
                  setToken={(token) => form.setValue("token", token)}
                />
              )}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewInstance };
