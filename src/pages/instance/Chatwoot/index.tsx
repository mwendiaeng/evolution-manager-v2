/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Tag } from "node_modules/react-tag-input/types/components/SingleTag";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WithContext as ReactTags } from "react-tag-input";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import { createChatwoot, fetchChatwoot } from "@/services/chatwoot.service";

import { Chatwoot as ChatwootType } from "@/types/evolution.types";

const FormSchema = z.object({
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
  daysLimitImportMessages: z.string(),
  autoCreate: z.boolean(),
  ignoreJids: z.array(z.string()).optional(),
});

function Chatwoot() {
  const { instance } = useInstance();
  const [, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const handleDeleteTag = (i: number) => {
    setTags(tags.filter((_tag, index) => index !== i));
  };

  const handleAdditionTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
      daysLimitImportMessages: "7",
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
        setTags(
          data.ignoreJids?.map((jid: any) => ({
            id: jid,
            text: jid,
            className: "",
          })) || [],
        );
        form.reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do chatwoot:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatwootData();
  }, [instance, form]);

  const onSubmit = async () => {
    if (!instance) return;

    const data = form.getValues();

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
        daysLimitImportMessages: parseInt(data.daysLimitImportMessages, 10),
        autoCreate: data.autoCreate,
        ignoreJids: data.ignoreJids,
      };

      await createChatwoot(instance.name, instance.token, chatwootData);
      toast.success("Chatwoot criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar chatwoot:", error);
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
            <h3 className="mb-1 text-lg font-medium">Chatwoot</h3>
            <Separator className="my-4" />
            <div className="mx-4 space-y-2 divide-y [&>*]:px-4 [&>*]:py-2">
              <FormSwitch
                name="enabled"
                label="Ativo"
                className="w-full justify-between"
                helper="Ativa ou desativa o chatwoot"
              />
              <FormInput name="url" label="URL do chatwoot">
                <Input />
              </FormInput>
              <FormInput name="accountId" label="ID da Conta">
                <Input />
              </FormInput>
              <FormInput name="token" label="Token da Conta">
                <Input type="password" />
              </FormInput>

              <FormSwitch
                name="signMsg"
                label="Assinar Mensagem"
                className="w-full justify-between"
                helper="Assina mensagem com o nome do usuário do chatwoot"
              />
              <FormInput name="signDelimiter" label="Delimitador de Assinatura">
                <Input />
              </FormInput>
              <FormInput name="nameInbox" label="Nome da Caixa de Entrada">
                <Input />
              </FormInput>
              <FormInput name="organization" label="Nome da organização">
                <Input />
              </FormInput>
              <FormInput name="logo" label="URL do logo">
                <Input />
              </FormInput>
              <FormSwitch
                name="conversationPending"
                label="Conversas Pendentes"
                className="w-full justify-between"
                helper="Conversas iniciam como pendentes"
              />
              <FormSwitch
                name="reopenConversation"
                label="Reabrir Conversa"
                className="w-full justify-between"
                helper="Reabre conversa ao receber mensagem"
              />
              <FormSwitch
                name="importContacts"
                label="Importar Contatos"
                className="w-full justify-between"
                helper="Importa contatos da agenda do whatsapp ao conectar o QR Code"
              />
              <FormSwitch
                name="importMessages"
                label="Importar Mensagens"
                className="w-full justify-between"
                helper="Importa conversas e mensagens do whatsapp ao conectar o QR Code"
              />
              <FormInput
                name="daysLimitImportMessages"
                label="Limite de Dias para Importar Mensagens"
              >
                <Input type="number" />
              </FormInput>
              <FormField
                control={form.control}
                name="ignoreJids"
                render={({ field }) => (
                  <div className="pb-4">
                    <label className="block text-sm font-medium">
                      Ignorar JIDs
                    </label>
                    <ReactTags
                      tags={tags}
                      handleDelete={handleDeleteTag}
                      handleAddition={handleAdditionTag}
                      inputFieldPosition="bottom"
                      placeholder="Adicionar JIDs ex: 1234567890@s.whatsapp.net"
                      autoFocus={false}
                      classNames={{
                        tags: "tagsClass",
                        tagInput: "tagInputClass",
                        tagInputField: "tagInputFieldClass",
                        selected: "selectedClass",
                        tag: "tagClass",
                        remove: "removeClass",
                        suggestions: "suggestionsClass",
                        activeSuggestion: "activeSuggestionClass",
                        editTagInput: "editTagInputClass",
                        editTagInputField: "editTagInputFieldClass",
                        clearAll: "clearAllClass",
                      }}
                    />
                    <input
                      type="hidden"
                      {...field}
                      value={tags.map((tag) => tag.text).join(",")}
                    />
                  </div>
                )}
              />
              <FormSwitch
                name="autoCreate"
                label="Criar Automaticamente"
                className="w-full justify-between"
                helper="Cria automaticamente integração com chatwoot ao Salvar"
              />
            </div>
          </div>
          <div className="mx-4 flex justify-end">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export { Chatwoot };
