import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useManageInstance } from "@/lib/queries/instance/manageInstance";

import { NewInstance as NewInstanceType } from "@/types/evolution.types";

const stringOrUndefined = z
  .string()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const FormSchema = z.object({
  name: z.string(),
  token: stringOrUndefined,
});

function NewInstance({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { createInstance } = useManageInstance();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      token: uuidv4().replace("-", "").toUpperCase(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const instanceData: NewInstanceType = {
        name: data.name,
        token: data.token === "" ? null : data.token,
      };

      await createInstance(instanceData);

      toast.success(t("toast.instance.created"));
      setOpen(false);
      onReset();
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error : ${error?.response?.data?.response?.message}`);
    }
  };

  const onReset = () => {
    form.reset({
      name: "",
      token: uuidv4().replace("-", "").toLocaleUpperCase(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {t("instance.button.create")} <PlusIcon size="18" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]" onCloseAutoFocus={onReset}>
        <DialogHeader>
          <DialogTitle>{t("instance.modal.title")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormInput required name="name" label={t("instance.form.name")}>
              <Input />
            </FormInput>
            <FormInput required name="token" label={t("instance.form.token")}>
              <Input />
            </FormInput>
            <DialogFooter>
              <Button type="submit">{t("instance.button.save")}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewInstance };
