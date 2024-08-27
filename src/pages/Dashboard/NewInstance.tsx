import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { FormInput, FormSelect } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useManageInstance } from "@/lib/queries/instance/manageInstance";
import { getToken, TOKEN_ID } from "@/lib/queries/token";

import { NewInstance as NewInstanceType } from "@/types/evolution.types";

import { LoginFacebookButton } from "./LoginFacebookButton";
import { LoginInstagramButton } from "./LoginInstagramButton";
import { LoginWhatsappButton } from "./LoginWhatsappButton";

const stringOrUndefined = z
  .string()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const FormSchema = z.object({
  name: z.string(),
  token: stringOrUndefined,
  number: stringOrUndefined,
  businessId: stringOrUndefined,
  integration: z.enum([
    "WHATSAPP-BUSINESS",
    "WHATSAPP-BAILEYS",
    "META-FACEBOOK",
    "META-INSTAGRAM",
    "EVOLUTION",
  ]),
});

function NewInstance({ resetTable }: { resetTable: () => void }) {
  const { t } = useTranslation();
  const { createInstance } = useManageInstance();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([
    {
      value: "WHATSAPP-BAILEYS",
      label: t("instance.form.integration.baileys"),
    },
    {
      value: "WHATSAPP-BUSINESS",
      label: t("instance.form.integration.whatsapp"),
    },
    {
      value: "EVOLUTION",
      label: t("instance.form.integration.evolution"),
    },
  ]);
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

  const facebookLogin =
    getToken(TOKEN_ID.FACEBOOK_USER_TOKEN) &&
    getToken(TOKEN_ID.FACEBOOK_CONFIG_ID) &&
    getToken(TOKEN_ID.FACEBOOK_APP_ID);

  useEffect(() => {
    if (facebookLogin) {
      setOptions([
        ...options,
        {
          value: "META-FACEBOOK",
          label: t("instance.form.integration.facebook"),
        },
        {
          value: "META-INSTAGRAM",
          label: t("instance.form.integration.instagram"),
        },
      ]);
    }
  }, [facebookLogin]);

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
            <FormSelect
              name="integration"
              label={t("instance.form.integration.label")}
              options={options}
            />
            <FormInput required name="token" label={t("instance.form.token")}>
              <Input />
            </FormInput>
            <FormInput name="number" label={t("instance.form.number")}>
              <Input type="tel" />
            </FormInput>
            {integrationSelected === "WHATSAPP-BUSINESS" && (
              <FormInput
                required
                name="businessId"
                label={t("instance.form.businessId")}
              >
                <Input />
              </FormInput>
            )}
            <DialogFooter>
              {facebookLogin && (
                <>
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
                </>
              )}

              <Button type="submit">{t("instance.button.save")}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewInstance };
