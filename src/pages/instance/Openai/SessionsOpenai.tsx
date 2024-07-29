/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { useInstance } from "@/contexts/InstanceContext";
import {
  ListCollapse,
  MoreHorizontal,
  Pause,
  Play,
  StopCircle,
} from "lucide-react";
import { Instance, OpenaiSession, TypebotSession } from "@/types/evolution.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import toastService from "@/utils/custom-toast.service";
import {
  changeStatusOpenai,
  fetchSessionsOpenai,
} from "@/services/openai.service";

const fetchData = async (
  instance: Instance | null,
  openaiBotId: string,
  setSessions: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const getSessions: OpenaiSession[] = await fetchSessionsOpenai(
        instance.name,
        storedToken,
        openaiBotId
      );

      setSessions(getSessions);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar sessões:", error);
  }
};

function SessionsOpenai({ openaiBotId }: { openaiBotId: string }) {
  const { instance } = useInstance();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [sessions, setSessions] = useState<TypebotSession[] | []>([]);

  useEffect(() => {
    fetchData(instance, openaiBotId, setSessions);
  }, [instance, openaiBotId]);

  function onReset() {
    fetchData(instance, openaiBotId, setSessions);
  }

  const changeStatus = async (remoteJid: string, status: string) => {
    try {
      if (!instance) return;

      await changeStatusOpenai(
        instance.name,
        instance.token,
        remoteJid,
        status
      );

      toastService.success("Status alterado com sucesso.");
      onReset();
    } catch (error: any) {
      console.error("Erro ao atualizar:", error);
      toastService.error(
        `Erro ao atualizar : ${error?.response?.data?.response?.message}`
      );
    }
  };

  const columns: ColumnDef<TypebotSession>[] = [
    {
      accessorKey: "remoteJid",
      header: () => <div className="text-center">Remote Jid</div>,
      cell: ({ row }) => <div>{row.getValue("remoteJid")}</div>,
    },
    {
      accessorKey: "sessionId",
      header: () => <div className="text-center">Session ID</div>,
      cell: ({ row }) => <div>{row.getValue("sessionId")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const session = row.original;

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
              {session.status !== "opened" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "opened")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Abrir
                </DropdownMenuItem>
              )}
              {session.status !== "paused" && session.status !== "closed" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "paused")}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </DropdownMenuItem>
              )}
              {session.status !== "closed" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "closed")}
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Fechar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: sessions,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-5 text-white">
          <ListCollapse /> Sessões
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[950px] overflow-y-auto"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>Sessões</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            placeholder="Search by remoteJid..."
            value={
              (table.getColumn("remoteJid")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("remoteJid")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border border-gray-300 rounded-md"
          />
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

export { SessionsOpenai };
