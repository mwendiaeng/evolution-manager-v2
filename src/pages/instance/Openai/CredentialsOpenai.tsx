/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowUpDown, Lock, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useInstance } from "@/contexts/InstanceContext";

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import {
  createOpenaiCreds,
  deleteOpenaiCreds,
  findOpenaiCreds,
} from "@/services/openai.service";

import { Instance, OpenaiCreds } from "@/types/evolution.types";

const FormSchema = z.object({
  name: z.string(),
  apiKey: z.string(),
});

const fetchData = async (instance: Instance | null, setCreds: any) => {
  try {
    const storedToken = getToken(TOKEN_ID.TOKEN);

    if (storedToken && instance && instance.name) {
      const getCreds: OpenaiCreds[] = await findOpenaiCreds(
        instance.name,
        storedToken,
      );

      setCreds(getCreds);
    } else {
      console.error("Token not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function CredentialsOpenai() {
  const { t } = useTranslation();
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
        throw new Error("instance not found.");
      }

      const credsData: OpenaiCreds = {
        name: data.name,
        apiKey: data.apiKey,
      };

      await createOpenaiCreds(instance.name, instance.token, credsData);
      toast.success(t("openai.toast.success.credentialsCreate"));
      onReset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
    }
  };

  function onReset() {
    form.reset();
    fetchData(instance, setCreds);
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteOpenaiCreds(id, instance?.name as string);
      toast.success(t("openai.toast.success.credentialsDelete"));
      fetchData(instance, setCreds);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error?.response?.data?.response?.message}`);
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
            {t("openai.credentials.table.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "apiKey",
      header: () => (
        <div className="text-right">{t("openai.credentials.table.apiKey")}</div>
      ),
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
                <span className="sr-only">
                  {t("openai.credentials.table.actions.title")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t("openai.credentials.table.actions.title")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(creds.id as string)}
              >
                {t("openai.credentials.table.actions.delete")}
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
        <Button variant="secondary" size="sm">
          <Lock size={16} className="mr-1" />
          <span className="hidden md:inline">
            {t("openai.credentials.title")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-h-[600px] sm:max-w-[740px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("openai.credentials.title")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="grid gap-3 md:grid-cols-2">
                <FormInput
                  name="name"
                  label={t("openai.credentials.table.name")}
                >
                  <Input />
                </FormInput>
                <FormInput
                  name="apiKey"
                  label={t("openai.credentials.table.apiKey")}
                >
                  <Input type="password" />
                </FormInput>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{t("openai.button.save")}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
        <Separator />
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
                              header.getContext(),
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
                          cell.getContext(),
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
                    {t("openai.credentials.table.none")}
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
