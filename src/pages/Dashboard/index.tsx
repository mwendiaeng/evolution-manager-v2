import { ChevronsUpDown, Cog, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { InstanceStatus } from "@/components/instance-status";
import { InstanceToken } from "@/components/instance-token";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useFetchInstances } from "@/lib/queries/instance/fetchInstances";
import { useManageInstance } from "@/lib/queries/instance/manageInstance";

import { Instance } from "@/types/evolution.types";

import { NewInstance } from "./NewInstance";

function Dashboard() {
  const { t } = useTranslation();

  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );
  const { deleteInstance, logout } = useManageInstance();
  const { data: instances, refetch } = useFetchInstances();
  const [deleting, setDeleting] = useState<string[]>([]);
  const [searchStatus, setSearchStatus] = useState("all");
  const [nameSearch, setNameSearch] = useState("");

  const resetTable = async () => {
    await refetch();
  };

  const handleDelete = async (token: string) => {
    setDeleteConfirmation(null);
    setDeleting([...deleting, token]);
    try {
      try {
        await logout(token);
      } catch (error) {
        console.error("Error logout:", error);
      }

      const instanceId = instances?.find(
        (instance) => instance.token === token,
      )?.id;

      if (instanceId) {
        await deleteInstance(instanceId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(`Instancia deletada`);
        resetTable();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error instance delete:", error);
      toast.error(`Error : ${error?.response?.data?.response?.message}`);
    } finally {
      setDeleting(deleting.filter((item) => item !== token));
    }
  };

  const filteredInstances = useMemo(() => {
    console.log(searchStatus, nameSearch);
    let instancesList = instances ? [...instances] : [];
    if (searchStatus !== "all") {
      instancesList = instancesList.filter((instance) =>
        searchStatus === "open" ? instance.connected : !instance.connected,
      );
    }

    if (nameSearch !== "") {
      instancesList = instancesList.filter((instance) =>
        instance.name.toLowerCase().includes(nameSearch.toLowerCase()),
      );
    }

    return instancesList;
  }, [instances, nameSearch, searchStatus]);

  const instanceStatus = [
    { value: "all", label: t("status.all") },
    { value: "close", label: t("status.closed") },
    { value: "connecting", label: t("status.connecting") },
    { value: "open", label: t("status.open") },
  ];

  return (
    <div className="my-4 px-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg">{t("dashboard.title")}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw onClick={resetTable} size="20" />
          </Button>
          <NewInstance resetTable={resetTable} />
        </div>
      </div>
      <div className="my-4 flex items-center justify-between gap-3 px-4">
        <div className="flex-1">
          <Input
            placeholder={t("dashboard.search")}
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              {t("dashboard.status")} <ChevronsUpDown size="15" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {instanceStatus.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={searchStatus === status.value}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSearchStatus(status.value);
                  }
                }}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredInstances.length > 0 &&
          Array.isArray(filteredInstances) &&
          filteredInstances.map((instance: Instance) => (
            <Card key={instance.name}>
              <CardHeader>
                <Link
                  to={`/manager/instance/${instance.id}/dashboard`}
                  className="flex w-full flex-row items-center justify-between gap-4"
                >
                  <h3 className="truncate text-wrap font-semibold">
                    {instance.name}
                  </h3>
                  <Button variant="ghost" size="icon">
                    <Cog className="card-icon" size="20" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <InstanceToken token={instance.token} />
              </CardContent>
              <CardFooter className="justify-between">
                <InstanceStatus connected={instance.connected} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmation(instance.token)}
                  disabled={deleting.includes(instance.token)}
                >
                  {deleting.includes(instance.token) ? (
                    <span>{t("button.deleting")}</span>
                  ) : (
                    <span>{t("button.delete")}</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </main>

      {!!deleteConfirmation && (
        <Dialog onOpenChange={() => setDeleteConfirmation(null)} open>
          <DialogContent>
            <DialogClose />
            <DialogHeader>{t("modal.delete.title")}</DialogHeader>
            <p>
              {t("modal.delete.message", { instanceName: deleteConfirmation })}
            </p>
            <DialogFooter>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setDeleteConfirmation(null)}
                  size="sm"
                  variant="outline"
                >
                  {t("button.cancel")}
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirmation)}
                  variant="destructive"
                >
                  {t("button.delete")}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Dashboard;
