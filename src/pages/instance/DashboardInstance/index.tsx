/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logout, connect } from "@/services/instances.service";
import QRCodePopup from "@/components/QRCodePopup";
import { useInstance } from "@/contexts/InstanceContext";

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
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [, setTimer] = useState(0);
  const token = localStorage.getItem("token");

  const { instance } = useInstance();

  const handleRestart = async () => {
    // verificar
  };

  const handleLogout = async (instanceName: string) => {
    try {
      await logout(instanceName);
      // verificar
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const handleConnect = async (instanceName: string) => {
    try {
      setShowQRCode(true);
      setQRCodeData("");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const data = await connect(instanceName, token);
      setQRCodeData(data.base64);
      setTimer(0);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  };

  const closeQRCodePopup = () => {
    setShowQRCode(false);
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
                <Button
                  className="connect-button"
                  onClick={() => handleConnect(instance.name)}
                >
                  CONECTAR
                </Button>
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
      {showQRCode && (
        <QRCodePopup qrCodeData={qrCodeData} onClose={closeQRCodePopup} />
      )}
    </>
  );
}

export { DashboardInstance };
