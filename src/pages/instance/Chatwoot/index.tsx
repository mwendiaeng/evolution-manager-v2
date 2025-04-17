/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import { useFetchChatwoot } from "@/lib/queries/chatwoot/fetchChatwoot";
import { useManageChatwoot } from "@/lib/queries/chatwoot/manageChatwoot";

import { Chatwoot as ChatwootType } from "@/types/evolution.types";

const stringOrUndefined = z
  .string()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const formSchema = z.object({
  enabled: z.boolean(),
  account_id: z.string(),
  token: z.string(),
  url: z.string(),
  sign_msg: z.boolean().optional(),
  sign_delimiter: stringOrUndefined,
  reopen_conversation: z.boolean().optional(),
  conversation_pending: z.boolean().optional(),
  import_contacts: z.boolean().optional(),
  import_messages: z.boolean().optional(),
  days_limit_import_messages: z.coerce.number().optional(),
  auto_create: z.boolean(),
});
type FormSchema = z.infer<typeof formSchema>;

function Chatwoot() {
  const { t } = useTranslation();
  const { instance } = useInstance();
  const [, setLoading] = useState(false);
  const { createChatwoot } = useManageChatwoot();
  const { data: chatwoot } = useFetchChatwoot({
    instanceName: instance?.instanceName,
    token: instance?.apikey,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      account_id: "",
      token: "",
      url: "",
      sign_msg: true,
      sign_delimiter: "\\n",
      reopen_conversation: true,
      conversation_pending: false,
      import_contacts: false,
      import_messages: false,
      days_limit_import_messages: 7,
      auto_create: true,
    },
  });

  useEffect(() => {
    if (chatwoot) {
      const chatwootData: ChatwootType = {
        enabled: chatwoot.enabled,
        account_id: chatwoot.account_id,
        token: chatwoot.token,
        url: chatwoot.url,
        sign_msg: chatwoot.sign_msg || false,
        sign_delimiter: chatwoot.sign_delimiter || "\\n",
        reopen_conversation: chatwoot.reopen_conversation || false,
        conversation_pending: chatwoot.conversation_pending || false,
        import_contacts: chatwoot.import_contacts || false,
        import_messages: chatwoot.import_messages || false,
        days_limit_import_messages: chatwoot.days_limit_import_messages || 7,
        auto_create: chatwoot.auto_create || false,
      };

      form.reset(chatwootData);
    }
  }, [chatwoot, form]);

  const onSubmit = async (data: FormSchema) => {
    if (!instance) return;

    setLoading(true);
    const chatwootData: ChatwootType = {
      enabled: data.enabled,
      account_id: data.account_id,
      token: data.token,
      url: data.url,
      sign_msg: data.sign_msg || false,
      sign_delimiter: data.sign_delimiter || "\\n",
      reopen_conversation: data.reopen_conversation || false,
      conversation_pending: data.conversation_pending || false,
      import_contacts: data.import_contacts || false,
      import_messages: data.import_messages || false,
      days_limit_import_messages: data.days_limit_import_messages || 7,
      auto_create: data.auto_create,
    };

    await createChatwoot(
      {
        instanceName: instance.instanceName,
        token: instance.apikey,
        data: chatwootData,
      },
      {
        onSuccess: () => {
          toast.success(t("chatwoot.toast.success"));
        },
        onError: (error) => {
          console.error(t("chatwoot.toast.error"), error);
          if (isAxiosError(error)) {
            toast.error(`Error: ${error?.response?.data?.response?.message}`);
          } else {
            toast.error(t("chatwoot.toast.error"));
          }
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-1 text-lg font-medium">{t("chatwoot.title")}</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:px-4 [&>*]:py-2">
              <FormSwitch
                name="enabled"
                label={t("chatwoot.form.enabled.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.enabled.description")}
              />
              <FormInput name="url" label={t("chatwoot.form.url.label")}>
                <Input />
              </FormInput>
              <FormInput
                name="account_id"
                label={t("chatwoot.form.account_id.label")}
              >
                <Input />
              </FormInput>
              <FormInput name="token" label={t("chatwoot.form.token.label")}>
                <Input type="password" />
              </FormInput>

              <FormSwitch
                name="sign_msg"
                label={t("chatwoot.form.sign_msg.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.sign_msg.description")}
              />
              <FormInput
                name="sign_delimiter"
                label={t("chatwoot.form.sign_delimiter.label")}
              >
                <Input />
              </FormInput>
              <FormSwitch
                name="reopen_conversation"
                label={t("chatwoot.form.reopen_conversation.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.reopen_conversation.description")}
              />
              <FormSwitch
                name="conversation_pending"
                label={t("chatwoot.form.conversation_pending.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.conversation_pending.description")}
              />
              <FormSwitch
                name="import_contacts"
                label={t("chatwoot.form.import_contacts.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.import_contacts.description")}
              />
              <FormSwitch
                name="import_messages"
                label={t("chatwoot.form.import_messages.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.import_messages.description")}
              />
              <FormInput
                name="days_limit_import_messages"
                label={t("chatwoot.form.days_limit_import_messages.label")}
              >
                <Input type="number" />
              </FormInput>
              <FormSwitch
                name="auto_create"
                label={t("chatwoot.form.auto_create.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.auto_create.description")}
              />
            </div>
          </div>
          <div className="mx-4 flex justify-end">
            <Button type="submit">{t("chatwoot.button.save")}</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Chatwoot };
