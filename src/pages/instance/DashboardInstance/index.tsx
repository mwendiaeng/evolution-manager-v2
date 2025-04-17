/* eslint-disable react-hooks/exhaustive-deps */
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { InstanceStatus } from "@/components/instance-status";
import { InstanceToken } from "@/components/instance-token";
import { useTheme } from "@/components/theme-provider";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInstance } from "@/contexts/InstanceContext";

import { useManageInstance } from "@/lib/queries/instance/manageInstance";
import { TOKEN_ID } from "@/lib/queries/token";

function DashboardInstance() {
  const { t } = useTranslation();
  // const numberFormatter = new Intl.NumberFormat(i18n.language);
  const [qrCode, setQRCode] = useState<string | null>(null);
  // const [pairingCode, setPairingCode] = useState("");
  const { theme } = useTheme();

  const { connect, getQrcode, logout, restart } = useManageInstance();
  const { instance, reloadInstance } = useInstance();

  useEffect(() => {
    if (instance) {
      localStorage.setItem(TOKEN_ID.INSTANCE_ID, instance.id);
      localStorage.setItem(TOKEN_ID.INSTANCE_NAME, instance.name);
      localStorage.setItem(TOKEN_ID.INSTANCE_TOKEN, instance.token);
    }
  }, [instance]);

  const handleReload = async () => {
    await reloadInstance();
  };

  const handleRestart = async (token: string) => {
    try {
      await restart(token);
      await reloadInstance();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = async (token: string) => {
    try {
      await logout(token);
      await reloadInstance();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConnect = async (
    token: string,
    pairingCode: boolean,
    number?: string,
  ) => {
    try {
      setQRCode(null);

      if (!token) {
        console.error("Token not found.");
        return;
      }

      if (pairingCode && number) {
        // await connect({
        //   subscribe: ["ALL"],
        //   token,
        //   webhookUrl: "",
        // });
        // const pairingCodeData = await pair({
        //   token,
        //   number: number!,
        // });
        // setPairingCode(pairingCodeData.data.pairingCode);
      } else {
        await connect({
          subscribe: ["ALL"],
          token,
          webhookUrl: "",
        });

        // espera 1 segundo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const qrcodeData = await getQrcode(token);

        setQRCode(qrcodeData.data.Code);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeQRCodePopup = async () => {
    setQRCode(null);
    // setPairingCode("");
    await reloadInstance();
  };

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
              <InstanceStatus connected={instance.connected} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-start space-y-6">
            <div className="flex w-full flex-1">
              <InstanceToken token={instance.token} />
            </div>
            {instance.connected === false && (
              <Alert
                variant="warning"
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <AlertTitle className="text-lg font-bold tracking-wide">
                  {t("instance.dashboard.alert")}
                </AlertTitle>

                <Dialog>
                  <DialogTrigger
                    onClick={() => handleConnect(instance.token, false)}
                    asChild
                  >
                    <Button variant="warning">
                      {t("instance.dashboard.button.qrcode.label")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent onCloseAutoFocus={closeQRCodePopup}>
                    <DialogHeader>
                      {t("instance.dashboard.button.qrcode.title")}
                    </DialogHeader>
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

                {/* {instance.number && (
                  <Dialog>
                    <DialogTrigger
                      className="connect-code-button"
                      onClick={() => handleConnect(instance.token, true)}
                    >
                      {t("instance.dashboard.button.pairingCode.label")}
                    </DialogTrigger>
                    <DialogContent onCloseAutoFocus={closeQRCodePopup}>
                      <DialogHeader>
                        <DialogDescription>
                          {pairingCode ? (
                            <div className="py-3">
                              <p className="text-center">
                                <strong>
                                  {t(
                                    "instance.dashboard.button.pairingCode.title",
                                  )}
                                </strong>
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
                )} */}
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
              onClick={() => handleRestart(instance.token)}
            >
              {t("instance.dashboard.button.restart").toUpperCase()}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleLogout(instance.token)}
              disabled={instance.connected === false}
            >
              {t("instance.dashboard.button.disconnect").toUpperCase()}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export { DashboardInstance };
