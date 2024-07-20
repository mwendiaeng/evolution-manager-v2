import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useForm, FormProvider, Controller } from "react-hook-form";

function NewInstance() {
  const methods = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon /> Instância
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Instância</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => console.log(data))}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                {...methods.register("name")}
                className="col-span-3 border border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="integration" className="text-right">
                Integração
              </Label>
              <Controller
                name="integration"
                control={methods.control}
                render={({ field }) => (
                  <Select {...field} defaultValue="WHATSAPP-BAILEYS">
                    <FormControl className="col-span-3 w-full border border-gray-600">
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="w-full"
                          placeholder="Selecione uma integração"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border border-gray-600">
                      <SelectItem value="WHATSAPP-BAILEYS">Baileys</SelectItem>
                      <SelectItem value="WHATSAPP-BUSINESS">
                        Whatsapp Oficial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="token" className="text-right">
                Token
              </Label>
              <Input
                id="token"
                {...methods.register("token")}
                className="col-span-3 border border-gray-600"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export { NewInstance };
