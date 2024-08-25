/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Delete,
  ListCollapse,
  MoreHorizontal,
  Pause,
  Play,
  RotateCcw,
  StopCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";

import { useInstance } from "@/contexts/InstanceContext";

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import {
  changeStatusOpenai,
  fetchSessionsOpenai,
} from "@/services/openai.service";

import { Instance, IntegrationSession } from "@/types/evolution.types";

const fetchData = async (
  instance: Instance | null,
  setSessions: any,
  botId?: string,
) => {
  try {
    const storedToken = getToken(TOKEN_ID.TOKEN);

    if (storedToken && instance && instance.name) {
      const getSessions: IntegrationSession[] = await fetchSessionsOpenai(
        instance.name,
        storedToken,
        botId,
      );

      setSessions(getSessions);
    } else {
      console.error("Token not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function SessionsOpenai({ openaiId }: { openaiId?: string }) {
  const { t } = useTranslation();
  const { instance } = useInstance();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [sessions, setSessions] = useState<IntegrationSession[] | []>([]);
  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (open) fetchData(instance, setSessions, openaiId);
  }, [instance, openaiId, open]);

  function onReset() {
    fetchData(instance, setSessions, openaiId);
  }

  const changeStatus = async (remoteJid: string, status: string) => {
    try {
      if (!instance) return;

      await changeStatusOpenai(
        instance.name,
        instance.token,
        remoteJid,
        status,
      );

      toast.success(t("openai.toast.success.status"));
      onReset();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error : ${error?.response?.data?.response?.message}`);
    }
  };

  const columns: ColumnDef<IntegrationSession>[] = [
    {
      accessorKey: "remoteJid",
      header: () => (
        <div className="text-center">
          {t("openai.sessions.table.remoteJid")}
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("remoteJid")}</div>,
    },
    {
      accessorKey: "pushName",
      header: () => (
        <div className="text-center">{t("openai.sessions.table.pushName")}</div>
      ),
      cell: ({ row }) => <div>{row.getValue("pushName")}</div>,
    },
    {
      accessorKey: "sessionId",
      header: () => (
        <div className="text-center">
          {t("openai.sessions.table.sessionId")}
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("sessionId")}</div>,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center">{t("openai.sessions.table.status")}</div>
      ),
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
              <Button variant="ghost" size="icon">
                <span className="sr-only">
                  {t("openai.sessions.table.actions.title")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t("openai.sessions.table.actions.title")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session.status !== "opened" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "opened")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {t("openai.sessions.table.actions.open")}
                </DropdownMenuItem>
              )}
              {session.status !== "paused" && session.status !== "closed" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "paused")}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  {t("openai.sessions.table.actions.pause")}
                </DropdownMenuItem>
              )}
              {session.status !== "closed" && (
                <DropdownMenuItem
                  onClick={() => changeStatus(session.remoteJid, "closed")}
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  {t("openai.sessions.table.actions.close")}
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => changeStatus(session.remoteJid, "delete")}
              >
                <Delete className="mr-2 h-4 w-4" />
                {t("openai.sessions.table.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <ListCollapse size={16} className="mr-1" />
          <span className="hidden md:inline">{t("openai.sessions.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto sm:max-w-[950px]"
        onCloseAutoFocus={onReset}
      >
        <DialogHeader>
          <DialogTitle>{t("openai.sessions.label")}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-between gap-6 p-5">
            <Input
              placeholder={t("openai.sessions.search")}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
            <Button variant="outline" onClick={onReset} size="icon">
              <RotateCcw size={16} />
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={sessions}
            onSortingChange={setSorting}
            state={{ sorting, globalFilter }}
            onGlobalFilterChange={setGlobalFilter}
            enableGlobalFilter
            noResultsMessage={t("openai.sessions.table.none")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SessionsOpenai };
