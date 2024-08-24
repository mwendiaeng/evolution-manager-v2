import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput, FormSelect, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { SessionsGenericBot } from "./SessionsGenericBot";

export const FormSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  apiUrl: z.string(),
  apiKey: z.string().optional(),
  triggerType: z.string(),
  triggerOperator: z.string().optional(),
  triggerValue: z.string().optional(),
  expire: z.coerce.number().optional(),
  keywordFinish: z.string().optional(),
  delayMessage: z.coerce.number().optional(),
  unknownMessage: z.string().optional(),
  listeningFromMe: z.boolean().optional(),
  stopBotFromMe: z.boolean().optional(),
  keepOpen: z.boolean().optional(),
  debounceTime: z.coerce.number().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

type GenericBotFormProps = {
  initialData?: FormSchemaType;
  onSubmit: (data: FormSchemaType) => Promise<void>;
  handleDelete?: () => void;
  genericBotId?: string;
  isModal?: boolean;
  isLoading?: boolean;
  openDeletionDialog?: boolean;
  setOpenDeletionDialog?: (value: boolean) => void;
};

function GenericBotForm({
  initialData,
  onSubmit,
  handleDelete,
  genericBotId,
  isModal = false,
  isLoading = false,
  openDeletionDialog = false,
  setOpenDeletionDialog = () => {},
}: GenericBotFormProps) {
  const { t } = useTranslation();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      enabled: true,
      description: "",
      apiUrl: "",
      apiKey: "",
      triggerType: "keyword",
      triggerOperator: "contains",
      triggerValue: "",
      expire: 0,
      keywordFinish: "",
      delayMessage: 0,
      unknownMessage: "",
      listeningFromMe: false,
      stopBotFromMe: false,
      keepOpen: false,
      debounceTime: 0,
    },
  });

  const triggerType = form.watch("triggerType");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4">
          <FormSwitch
            name="enabled"
            label={t("genericBot.form.enabled.label")}
            reverse
          />
          <FormInput
            name="description"
            label={t("genericBot.form.description.label")}
            required
          >
            <Input />
          </FormInput>

          <div className="flex flex-col">
            <h3 className="my-4 text-lg font-medium">
              {t("genericBot.form.genericBotSettings.label")}
            </h3>
            <Separator />
          </div>
          <FormInput
            name="apiUrl"
            label={t("genericBot.form.apiUrl.label")}
            required
          >
            <Input />
          </FormInput>
          <FormInput name="apiKey" label={t("genericBot.form.apiKey.label")}>
            <Input type="password" />
          </FormInput>

          <div className="flex flex-col">
            <h3 className="my-4 text-lg font-medium">
              {t("genericBot.form.triggerSettings.label")}
            </h3>
            <Separator />
          </div>
          <FormSelect
            name="triggerType"
            label={t("genericBot.form.triggerType.label")}
            options={[
              {
                label: t("genericBot.form.triggerType.keyword"),
                value: "keyword",
              },
              {
                label: t("genericBot.form.triggerType.all"),
                value: "all",
              },
              {
                label: t("genericBot.form.triggerType.advanced"),
                value: "advanced",
              },
              {
                label: t("genericBot.form.triggerType.none"),
                value: "none",
              },
            ]}
          />

          {triggerType === "keyword" && (
            <>
              <FormSelect
                name="triggerOperator"
                label={t("genericBot.form.triggerOperator.label")}
                options={[
                  {
                    label: t("genericBot.form.triggerOperator.contains"),
                    value: "contains",
                  },
                  {
                    label: t("genericBot.form.triggerOperator.equals"),
                    value: "equals",
                  },
                  {
                    label: t("genericBot.form.triggerOperator.startsWith"),
                    value: "startsWith",
                  },
                  {
                    label: t("genericBot.form.triggerOperator.endsWith"),
                    value: "endsWith",
                  },
                  {
                    label: t("genericBot.form.triggerOperator.regex"),
                    value: "regex",
                  },
                ]}
              />
              <FormInput
                name="triggerValue"
                label={t("genericBot.form.triggerValue.label")}
              >
                <Input />
              </FormInput>
            </>
          )}
          {triggerType === "advanced" && (
            <FormInput
              name="triggerValue"
              label={t("genericBot.form.triggerConditions.label")}
            >
              <Input />
            </FormInput>
          )}
          <div className="flex flex-col">
            <h3 className="my-4 text-lg font-medium">
              {t("genericBot.form.generalSettings.label")}
            </h3>
            <Separator />
          </div>
          <FormInput name="expire" label={t("genericBot.form.expire.label")}>
            <Input type="number" />
          </FormInput>
          <FormInput
            name="keywordFinish"
            label={t("genericBot.form.keywordFinish.label")}
          >
            <Input />
          </FormInput>
          <FormInput
            name="delayMessage"
            label={t("genericBot.form.delayMessage.label")}
          >
            <Input type="number" />
          </FormInput>
          <FormInput
            name="unknownMessage"
            label={t("genericBot.form.unknownMessage.label")}
          >
            <Input />
          </FormInput>
          <FormSwitch
            name="listeningFromMe"
            label={t("genericBot.form.listeningFromMe.label")}
            reverse
          />
          <FormSwitch
            name="stopBotFromMe"
            label={t("genericBot.form.stopBotFromMe.label")}
            reverse
          />
          <FormSwitch
            name="keepOpen"
            label={t("genericBot.form.keepOpen.label")}
            reverse
          />
          <FormInput
            name="debounceTime"
            label={t("genericBot.form.debounceTime.label")}
          >
            <Input type="number" />
          </FormInput>
        </div>

        {isModal && (
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              {isLoading
                ? t("genericBot.button.saving")
                : t("genericBot.button.save")}
            </Button>
          </DialogFooter>
        )}

        {!isModal && (
          <div>
            <SessionsGenericBot genericBotId={genericBotId} />
            <div className="flex items-center gap-3">
              <Dialog
                open={openDeletionDialog}
                onOpenChange={setOpenDeletionDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {t("dify.button.delete")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("modal.delete.title")}</DialogTitle>
                    <DialogDescription>
                      {t("modal.delete.messageSingle")}
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenDeletionDialog(false)}
                      >
                        {t("button.cancel")}
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        {t("button.delete")}
                      </Button>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button disabled={isLoading} type="submit">
                {isLoading
                  ? t("genericBot.button.saving")
                  : t("genericBot.button.update")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export { GenericBotForm };
