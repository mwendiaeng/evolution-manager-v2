/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSwitch, FormTags } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import { createChatwoot, fetchChatwoot } from "@/services/chatwoot.service";

import { Chatwoot as ChatwootType } from "@/types/evolution.types";

const formSchema = z.object({
  enabled: z.boolean(),
  accountId: z.string(),
  token: z.string(),
  url: z.string(),
  signMsg: z.boolean(),
  signDelimiter: z.string(),
  nameInbox: z.string(),
  organization: z.string(),
  logo: z.string(),
  reopenConversation: z.boolean(),
  conversationPending: z.boolean(),
  mergeBrazilContacts: z.boolean(),
  importContacts: z.boolean(),
  importMessages: z.boolean(),
  daysLimitImportMessages: z.coerce.number(),
  autoCreate: z.boolean(),
  ignoreJids: z.array(z.string()).default([]),
});
type FormSchema = z.infer<typeof formSchema>;

function Chatwoot() {
  const { t } = useTranslation();
  const { instance } = useInstance();
  const [, setLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      accountId: "",
      token: "",
      url: "",
      signMsg: true,
      signDelimiter: "\\n",
      nameInbox: "",
      organization: "",
      logo: "",
      reopenConversation: true,
      conversationPending: false,
      mergeBrazilContacts: true,
      importContacts: false,
      importMessages: false,
      daysLimitImportMessages: 7,
      autoCreate: true,
      ignoreJids: [],
    },
  });

  useEffect(() => {
    const loadChatwootData = async () => {
      if (!instance) return;
      setLoading(true);
      try {
        const data = await fetchChatwoot(instance.name, instance.token);
        form.setValue("ignoreJids", data.ignoreJids || []);
        form.reset(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatwootData();
  }, [instance, form]);

  const onSubmit = async (data: FormSchema) => {
    if (!instance) return;

    setLoading(true);
    try {
      const chatwootData: ChatwootType = {
        enabled: data.enabled,
        accountId: data.accountId,
        token: data.token,
        url: data.url,
        signMsg: data.signMsg,
        signDelimiter: data.signDelimiter,
        nameInbox: data.nameInbox,
        organization: data.organization,
        logo: data.logo,
        reopenConversation: data.reopenConversation,
        conversationPending: data.conversationPending,
        mergeBrazilContacts: data.mergeBrazilContacts,
        importContacts: data.importContacts,
        importMessages: data.importMessages,
        daysLimitImportMessages: data.daysLimitImportMessages,
        autoCreate: data.autoCreate,
        ignoreJids: data.ignoreJids,
      };

      await createChatwoot(instance.name, instance.token, chatwootData);
      toast.success(t("chatwoot.toast.success"));
    } catch (error: any) {
      console.error(t("chatwoot.toast.error"), error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
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
                name="accountId"
                label={t("chatwoot.form.accountId.label")}
              >
                <Input />
              </FormInput>
              <FormInput name="token" label={t("chatwoot.form.token.label")}>
                <Input type="password" />
              </FormInput>

              <FormSwitch
                name="signMsg"
                label={t("chatwoot.form.signMsg.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.signMsg.description")}
              />
              <FormInput
                name="signDelimiter"
                label={t("chatwoot.form.signDelimiter.label")}
              >
                <Input />
              </FormInput>
              <FormInput
                name="nameInbox"
                label={t("chatwoot.form.nameInbox.label")}
              >
                <Input />
              </FormInput>
              <FormInput
                name="organization"
                label={t("chatwoot.form.organization.label")}
              >
                <Input />
              </FormInput>
              <FormInput name="logo" label={t("chatwoot.form.logo.label")}>
                <Input />
              </FormInput>
              <FormSwitch
                name="conversationPending"
                label={t("chatwoot.form.conversationPending.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.conversationPending.description")}
              />
              <FormSwitch
                name="reopenConversation"
                label={t("chatwoot.form.reopenConversation.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.reopenConversation.description")}
              />
              <FormSwitch
                name="importContacts"
                label={t("chatwoot.form.importContacts.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.importContacts.description")}
              />
              <FormSwitch
                name="importMessages"
                label={t("chatwoot.form.importMessages.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.importMessages.description")}
              />
              <FormInput
                name="daysLimitImportMessages"
                label={t("chatwoot.form.daysLimitImportMessages.label")}
              >
                <Input type="number" />
              </FormInput>
              <FormTags
                name="ignoreJids"
                label={t("chatwoot.form.ignoreJids.label")}
                placeholder={t("chatwoot.form.ignoreJids.placeholder")}
              />
              <FormSwitch
                name="autoCreate"
                label={t("chatwoot.form.autoCreate.label")}
                className="w-full justify-between"
                helper={t("chatwoot.form.autoCreate.description")}
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
