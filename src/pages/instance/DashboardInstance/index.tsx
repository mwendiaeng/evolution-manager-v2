/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logout, connect } from "@/services/instances.service";
import { useInstance } from "@/contexts/InstanceContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const getStatusClass = (status: string) => {
  switch (status) {
    case "open":
      return "status-connected";
    case "close":
      return "status-disconnected";
    case "connecting":
      return "status-connecting";
    default:
      return "status-disconnected";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "open":
      return "Conectado";
    case "close":
      return "Desconectado";
    case "connecting":
      return "Conectando";
    default:
      return "Desconectado";
  }
};

function DashboardInstance() {
  const [qrCodeData, setQRCodeData] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [, setTimer] = useState(0);
  const token = localStorage.getItem("token");

  const { instance } = useInstance();

  const handleRestart = async () => {};

  const handleLogout = async (instanceName: string) => {
    try {
      await logout(instanceName);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const handleConnect = async (instanceName: string, pairingCode: boolean) => {
    try {
      setQRCodeData("");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      if (pairingCode) {
        const data = await connect(instanceName, token, instance?.number);

        setPairingCode(data.pairingCode);
      } else {
        const data = await connect(instanceName, token);

        setQRCodeData(data.base64);
      }
      setTimer(0);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  };

  const closeQRCodePopup = () => {
    setQRCodeData("");
  };

  if (!instance) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <main className="dashboard-instance">
        <div className="dashboard-card" key={instance.id}>
          <div className="dashboard-info">
            <div
              className={`dashboard-status ${getStatusClass(
                instance.connectionStatus
              )}`}
            >
              <i
                className={`status-icon ${getStatusClass(
                  instance.connectionStatus
                )}`}
              ></i>
              <span className="status-text">
                {getStatusText(instance.connectionStatus)}
              </span>
            </div>
            <div className="dashboard-name">{instance.name}</div>
            <div className="dashboard-description">{instance.ownerJid}</div>
            {instance.connectionStatus === "close" && (
              <div className="connection-warning">
                <span>Telefone não conectado</span>

                <Dialog>
                  <DialogTrigger
                    className="connect-button"
                    onClick={() => handleConnect(instance.name, false)}
                  >
                    Gerar QRCODE
                  </DialogTrigger>
                  <DialogContent onCloseAutoFocus={closeQRCodePopup}>
                    <DialogHeader>
                      <DialogDescription>
                        {qrCodeData ? (
                          <img src={qrCodeData} alt="QR Code" />
                        ) : (
                          <img
                            src="/assets/images/evolution-logo.png"
                            alt="Carregando..."
                          />
                        )}
                      </DialogDescription>
                    </DialogHeader>
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
                            <div>
                              <p>
                                <strong>Código de emparelhamento:</strong>
                              </p>
                              <p>{pairingCode}</p>
                            </div>
                          ) : (
                            <div>
                              <p>Carregando...</p>
                            </div>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
          <div className="dashboard-actions">
            <Button className="action-button" onClick={handleRestart}>
              REINICIAR
            </Button>
            <Button
              className={`action-button ${
                instance.connectionStatus === "close" ? "disabled" : ""
              }`}
              onClick={() => handleLogout(instance.name)}
              disabled={instance.connectionStatus === "close"}
            >
              DESCONECTAR
            </Button>
          </div>
        </div>
      </main>
      <main className="instance-cards">
        <Card className="instance-card">
          <CardHeader>
            <CardTitle>Contatos</CardTitle>
          </CardHeader>
          <CardContent>0</CardContent>
        </Card>
        <Card className="instance-card">
          <CardHeader>
            <CardTitle>Chats</CardTitle>
          </CardHeader>
          <CardContent>0</CardContent>
        </Card>
        <Card className="instance-card">
          <CardHeader>
            <CardTitle>Mensagens</CardTitle>
          </CardHeader>
          <CardContent>0</CardContent>
        </Card>
      </main>
    </>
  );
}

export { DashboardInstance };
