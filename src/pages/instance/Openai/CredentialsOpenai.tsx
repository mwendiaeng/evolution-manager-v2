/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useInstance } from "@/contexts/InstanceContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown, Lock, MoreHorizontal } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Instance, OpenaiCreds } from "@/types/evolution.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createOpenaiCreds,
  deleteOpenaiCreds,
  findOpenaiCreds,
} from "@/services/openai.service";
import toastService from "@/utils/custom-toast.service";

const FormSchema = z.object({
  name: z.string(),
  apiKey: z.string(),
});

const fetchData = async (instance: Instance | null, setCreds: any) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getCreds: OpenaiCreds[] = await findOpenaiCreds(
        instance.name,
        storedToken
      );

      setCreds(getCreds);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
};

function CredentialsOpenai() {
  const { instance } = useInstance();

  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [creds, setCreds] = useState<OpenaiCreds[] | []>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      apiKey: "",
    },
  });

  useEffect(() => {
    if (open) fetchData(instance, setCreds);
  }, [instance, open]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!instance || !instance.name) {
        throw new Error("Nome da instância não encontrado.");
      }

      const credsData: OpenaiCreds = {
        name: data.name,
        apiKey: data.apiKey,
      };

      await createOpenaiCreds(instance.name, instance.token, credsData);
      toastService.success("Credencial criada com sucesso!");
      onReset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar bot:", error);
      toastService.error(
        `Erro ao criar : ${error?.response?.data?.response?.message}`
      );
    }
  };

  function onReset() {
    form.reset();
    fetchData(instance, setCreds);
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteOpenaiCreds(id, instance?.name as string);
      toastService.success("Credencial excluída com sucesso!");
      fetchData(instance, setCreds);
    } catch (error: any) {
      console.error("Erro ao excluir credencial:", error);
      toastService.error(
        `Erro ao excluir credencial: ${error?.response?.data?.response?.message}`
      );
    }
  };

  const columns: ColumnDef<OpenaiCreds>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "apiKey",
      header: () => <div className="text-right">Api Key</div>,
      cell: ({ row }) => (
        <div>{`${row.getValue("apiKey")}`.slice(0, 20)}...</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const creds = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(creds.id as string)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: creds,
    columns: columns as ColumnDef<unknown, any>[],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5">
          <Lock /> Credenciais
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[740px] sm:max-h-[600px] overflow-y-auto"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>Credenciais</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Nome</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Nome"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem className="pb-4">
                      <FormLabel>Api Key</FormLabel>
                      <Input
                        {...field}
                        className="border border-gray-600 w-full"
                        placeholder="Api Key"
                        type="password"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="default" type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
        <Separator className="border border-gray-700" />
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CredentialsOpenai };
