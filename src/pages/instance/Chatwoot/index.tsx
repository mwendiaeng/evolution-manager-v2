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
    <main className="main-content">
      <div className="form-container">
        <Form {...form}>
          <form className="w-full space-y-6">
            <div>
              <h3 className="mb-1 text-lg font-medium">Chatwoot</h3>
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
                          Ativa ou desativa o chatwoot
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
                  name="url"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="URL do chatwoot"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="ID da Conta"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="Token da Conta"
                      type="password"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="signMsg"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Assinar Mensagem
                        </FormLabel>
                        <FormDescription>
                          Assina mensagem com o nome do usuário do chatwoot
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
                  name="signDelimiter"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="Delimitador de Assinatura"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameInbox"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="Nome da Caixa de Entrada"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="Nome da organização"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="URL do logo"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="conversationPending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Conversas Pendentes
                        </FormLabel>
                        <FormDescription>
                          Conversas iniciam como pendentes
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
                  name="reopenConversation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Reabrir Conversa
                        </FormLabel>
                        <FormDescription>
                          Reabre conversa ao receber mensagem
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
                  name="importContacts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Importar Contatos
                        </FormLabel>
                        <FormDescription>
                          Importa contatos da agenda do whatsapp ao conectar o
                          qrcode
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
                  name="importMessages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Importar Mensagens
                        </FormLabel>
                        <FormDescription>
                          Importa conversas e mensagens do whatsapp ao conectar
                          o qrcode
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
                  name="daysLimitImportMessages"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full border border-gray-600"
                      placeholder="Limite de Dias para Importar Mensagens"
                      type="number"
                    />
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="autoCreate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Criar Automaticamente
                        </FormLabel>
                        <FormDescription>
                          Cria automaticamente integração com chatwoot ao Salvar
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
              </div>
            </div>
            <Button type="button" onClick={onSubmit}>
              Salvar
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

export { Chatwoot };
