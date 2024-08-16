import { DoorOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "@/services/auth.service";
import { fetchInstance } from "@/services/instances.service";

import { Instance } from "@/types/evolution.types";

import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";

function Header({ instanceId }: { instanceId?: string }) {
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    logout();
    navigate("/manager/login");
  };

  const navigateToDashboard = () => {
    navigate("/manager/");
  };

  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    if (instanceId) {
      const fetchData = async (instanceId: string) => {
        try {
          const data = await fetchInstance(instanceId);
          setInstance(data[0] || null);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      fetchData(instanceId);
    }
  }, [instanceId]);

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <Link
        to="/manager"
        onClick={navigateToDashboard}
        className="flex h-8 items-center gap-4"
      >
        <img
          src="/assets/images/evolution-logo.png"
          alt="Logo"
          className="h-full"
        />
        <span>Evolution Manager</span>
      </Link>
      <div className="flex items-center gap-4">
        {instanceId && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                instance?.profilePicUrl || "/assets/images/evolution-logo.png"
              }
              alt={instance?.name}
            />
          </Avatar>
        )}
        <ModeToggle />
        <Button
          onClick={() => setLogoutConfirmation(true)}
          variant="destructive"
          size="icon"
        >
          <DoorOpen size="18" />
        </Button>
      </div>

      {logoutConfirmation && (
        <Dialog onOpenChange={setLogoutConfirmation} open={logoutConfirmation}>
          <DialogContent>
            <DialogClose />
            <DialogHeader>Deseja realmente desconectar?</DialogHeader>
            <DialogFooter>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setLogoutConfirmation(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button onClick={handleClose} variant="destructive">
                  Desconectar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}

export { Header };
