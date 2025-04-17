import {
  ChevronsUpDown,
  CircleUser,
  Cog,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
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

  const handleDelete = async (instanceName: string) => {
    setDeleteConfirmation(null);
    setDeleting([...deleting, instanceName]);
    try {
      try {
        await logout(instanceName);
      } catch (error) {
        console.error("Error logout:", error);
      }
      await deleteInstance(instanceName);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Instancia deletada`);
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error instance delete:", error);
      toast.error(`Error : ${error?.response?.data?.response?.message}`);
    } finally {
      setDeleting(deleting.filter((item) => item !== instanceName));
    }
  };

  const filteredInstances = useMemo(() => {
    console.log(searchStatus, nameSearch);
    let instancesList = instances ? [...instances] : [];
    if (searchStatus !== "all") {
      instancesList = instancesList.filter(
        (instance) => instance.status === searchStatus,
      );
    }

    if (nameSearch !== "") {
      instancesList = instancesList.filter((instance) =>
        instance.instanceName.toLowerCase().includes(nameSearch.toLowerCase()),
      );
    }

    console.log(instancesList);

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
            <Card key={instance.instanceName}>
              <CardHeader>
                <Link
                  to={`/manager/instance/${instance.instanceName}/dashboard`}
                  className="flex w-full flex-row items-center justify-between gap-4"
                >
                  <h3 className="truncate text-wrap font-semibold">
                    {instance.instanceName}
                  </h3>
                  <Button variant="ghost" size="icon">
                    <Cog className="card-icon" size="20" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <InstanceToken token={instance.apikey} />
                <div className="flex w-full flex-wrap">
                  <div className="flex items-center justify-end gap-4 text-sm">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <CircleUser className="text-muted-foreground" size="20" />
                      <span>
                        {new Intl.NumberFormat("pt-BR").format(
                          instance?._count?.Contact || 0,
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <MessageCircle
                        className="text-muted-foreground"
                        size="20"
                      />
                      <span>
                        {new Intl.NumberFormat("pt-BR").format(
                          instance?._count?.Message || 0,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <InstanceStatus status={instance.status} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmation(instance.instanceName)}
                  disabled={deleting.includes(instance.instanceName)}
                >
                  {deleting.includes(instance.instanceName) ? (
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
