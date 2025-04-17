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
import { FormInput, FormSwitch } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { SessionsTypebot } from "./SessionsTypebot";

export const FormSchema = z.object({
  enabled: z.boolean(),
  url: z.string(),
  typebot: z.string().optional(),
  expire: z.coerce.number().optional(),
  keyword_finish: z.string().optional(),
  delay_message: z.coerce.number().optional(),
  unknown_message: z.string().optional(),
  listening_from_me: z.boolean().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

type TypebotFormProps = {
  initialData?: FormSchemaType;
  onSubmit: (data: FormSchemaType) => Promise<void>;
  handleDelete?: () => void;
  typebotId?: string;
  isModal?: boolean;
  isLoading?: boolean;
  openDeletionDialog?: boolean;
  setOpenDeletionDialog?: (value: boolean) => void;
};

function TypebotForm({
  initialData,
  onSubmit,
  handleDelete,
  typebotId,
  isModal = false,
  isLoading = false,
  openDeletionDialog = false,
  setOpenDeletionDialog = () => {},
}: TypebotFormProps) {
  const { t } = useTranslation();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      enabled: true,
      url: "",
      typebot: "",
      expire: 0,
      keyword_finish: "",
      delay_message: 0,
      unknown_message: "",
      listening_from_me: false,
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4">
          <FormSwitch
            name="enabled"
            label={t("typebot.form.enabled.label")}
            reverse
          />

          <div className="flex flex-col">
            <h3 className="my-4 text-lg font-medium">
              {t("typebot.form.typebotSettings.label")}
            </h3>
            <Separator />
          </div>
          <FormInput name="url" label={t("typebot.form.url.label")} required>
            <Input />
          </FormInput>
          <FormInput name="typebot" label={t("typebot.form.typebot.label")}>
            <Input />
          </FormInput>

          <div className="flex flex-col">
            <h3 className="my-4 text-lg font-medium">
              {t("typebot.form.generalSettings.label")}
            </h3>
            <Separator />
          </div>
          <FormInput name="expire" label={t("typebot.form.expire.label")}>
            <Input type="number" />
          </FormInput>
          <FormInput
            name="keyword_finish"
            label={t("typebot.form.keyword_finish.label")}
          >
            <Input />
          </FormInput>
          <FormInput
            name="delay_message"
            label={t("typebot.form.delay_message.label")}
          >
            <Input type="number" />
          </FormInput>
          <FormInput
            name="unknown_message"
            label={t("typebot.form.unknown_message.label")}
          >
            <Input />
          </FormInput>
          <FormSwitch
            name="listening_from_me"
            label={t("typebot.form.listening_from_me.label")}
            reverse
          />
        </div>

        {isModal && (
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              {isLoading
                ? t("typebot.button.saving")
                : t("typebot.button.save")}
            </Button>
          </DialogFooter>
        )}

        {!isModal && (
          <div>
            <SessionsTypebot typebotId={typebotId} />
            <div className="mt-5 flex items-center gap-3">
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
                  ? t("typebot.button.saving")
                  : t("typebot.button.update")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export { TypebotForm };
