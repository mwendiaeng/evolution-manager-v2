/* eslint-disable react-hooks/exhaustive-deps */
import { CircleUser, MessageCircle, RefreshCw, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

import { InstanceStatus } from "@/components/instance-status";
import { InstanceToken } from "@/components/instance-token";
import { useTheme } from "@/components/theme-provider";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import { logout, connect, restart } from "@/services/instances.service";

const numberFormatter = new Intl.NumberFormat("pt-BR");

function DashboardInstance() {
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState("");
  const token = localStorage.getItem("token");
  const { theme } = useTheme();

  const { instance } = useInstance();

  const handleReload = () => {
    window.location.reload();
  };

  const handleRestart = async (instanceName: string) => {
    try {
      await restart(instanceName);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao reiniciar:", error);
    }
  };

  const handleLogout = async (instanceName: string) => {
    try {
      await logout(instanceName);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const handleConnect = async (instanceName: string, pairingCode: boolean) => {
    try {
      setQRCode(null);

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      if (pairingCode) {
        const data = await connect(instanceName, token, instance?.number);

        setPairingCode(data.pairingCode);
      } else {
        const data = await connect(instanceName, token);

        setQRCode(data.code);
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  };

  const closeQRCodePopup = () => {
    setQRCode(null);
    setPairingCode("");
    window.location.reload();
  };

  const stats = useMemo(() => {
    if (!instance) {
      return {
        contacts: 0,
        chats: 0,
        messages: 0,
      };
    }

    return {
      contacts: instance._count?.Contact || 0,
      chats: instance._count?.Chat || 0,
      messages: instance._count?.Message || 0,
    };
  }, [instance]);

  const qrCodeColor = useMemo(() => {
    if (theme === "dark") {
      return "#fff";
    }
    if (theme === "light") {
      return "#000";
    }
    return "#189d68";
  }, [theme]);

  if (!instance) {
    return <LoadingSpinner />;
  }

  return (
    <main className="flex flex-col gap-8">
      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="break-all text-lg font-semibold">
                {instance.name}
              </h2>
              <InstanceStatus status={instance.connectionStatus} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-start space-y-6">
            <div className="flex w-full flex-1">
              <InstanceToken token={instance.token} />
            </div>

            {instance.profileName && (
              <div className="flex flex-1 gap-2">
                <Avatar>
                  <AvatarImage src={instance.profilePicUrl} alt="" />
                </Avatar>
                <div className="space-y-1">
                  <strong>{instance.profileName}</strong>
                  <p className="break-all text-sm text-muted-foreground">
                    {instance.ownerJid}
                  </p>
                </div>
              </div>
            )}
            {instance.connectionStatus !== "open" && (
              <Alert
                variant="warning"
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <AlertTitle className="text-lg font-bold tracking-wide">
                  Telefone não conectado
                </AlertTitle>

                <Dialog>
                  <DialogTrigger
                    onClick={() => handleConnect(instance.name, false)}
                    asChild
                  >
                    <Button variant="warning">Gerar QRCODE</Button>
                  </DialogTrigger>
                  <DialogContent onCloseAutoFocus={closeQRCodePopup}>
                    <DialogHeader>Leia o QR Code para conectar</DialogHeader>
                    <div className="flex items-center justify-center">
                      {qrCode && (
                        <QRCode
                          value={qrCode}
                          size={256}
                          bgColor="transparent"
                          fgColor={qrCodeColor}
                          className="rounded-sm"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {instance.number && (
                  <Dialog>
                    <DialogTrigger
                      className="connect-code-button"
                      onClick={() => handleConnect(instance.name, true)}
                    >
                      Solicitar Código
                    </DialogTrigger>
                    <DialogContent onCloseAutoFocus={closeQRCodePopup}>
                      <DialogHeader>
                        <DialogDescription>
                          {pairingCode ? (
                            <div className="py-3">
                              <p className="text-center">
                                <strong>Código de emparelhamento:</strong>
                              </p>
                              <p className="pairing-code text-center">
                                {pairingCode.substring(0, 4)}-
                                {pairingCode.substring(4, 8)}
                              </p>
                            </div>
                          ) : (
                            <LoadingSpinner />
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="outline"
              className="refresh-button"
              size="icon"
              onClick={handleReload}
            >
              <RefreshCw size="20" />
            </Button>
            <Button
              className="action-button"
              variant="secondary"
              onClick={() => handleRestart(instance.name)}
            >
              REINICIAR
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleLogout(instance.name)}
              disabled={instance.connectionStatus !== "open"}
            >
              DESCONECTAR
            </Button>
          </CardFooter>
        </Card>
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,_minmax(15rem,_1fr))] gap-6">
        <Card className="instance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser size="20" /> Contatos
            </CardTitle>
          </CardHeader>
          <CardContent>{numberFormatter.format(stats.contacts)}</CardContent>
        </Card>
        <Card className="instance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersRound size="20" />
              Chats
            </CardTitle>
          </CardHeader>
          <CardContent>{numberFormatter.format(stats.chats)}</CardContent>
        </Card>
        <Card className="instance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size="20" />
              Mensagens
            </CardTitle>
          </CardHeader>
          <CardContent>{numberFormatter.format(stats.messages)}</CardContent>
        </Card>
      </section>
    </main>
  );
}

export { DashboardInstance };
