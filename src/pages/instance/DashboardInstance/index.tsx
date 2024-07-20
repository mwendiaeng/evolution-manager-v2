<<<<<<< HEAD
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInstances, restart, logout, connect } from "@/services/instances.service";
import { Instance } from "@/types/evolution.types";
import QRCodePopup from "@/components/QRCodePopup";
import { useParams } from "react-router-dom";

const fetchData = async (instanceName: string, callback: (data: Instance) => void) => {
  try {
    const instances = await fetchInstances();
    const instance = instances.find(inst => inst.name === instanceName);
    if (instance) {
      callback(instance);
    } else {
      console.error("Instância não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

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
  const [instance, setInstance] = useState<Instance | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [timer, setTimer] = useState(0);
  const { instanceId } = useParams<{ instanceId: string }>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (instanceId) {
      const getData = async () => {
        await fetchData(instanceId, (data) => {
          setInstance(data);
        });
      };

      getData();

      const interval = setInterval(getData, 10000); // Atualiza a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [instanceId]);

  const handleRestart = async () => {
    try {
      await restart();
      if (instanceId) {
        const data = await fetchInstances();
        const updatedInstance = data.find(inst => inst.name === instanceId);
        setInstance(updatedInstance || null);
      }
    } catch (error) {
      console.error("Erro ao reiniciar:", error);
    }
  };

  const handleLogout = async (instanceName: string) => {
    try {
      await logout(instanceName);
      if (instanceId) {
        const data = await fetchInstances();
        const updatedInstance = data.find(inst => inst.name === instanceId);
        setInstance(updatedInstance || null);
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const handleConnect = async (instanceName: string) => {
    try {
      setShowQRCode(true); // Abre o popup imediatamente ao clicar no botão
      setQRCodeData(""); // Limpa o QR code anterior, se houver

      const data = await connect(instanceName, token);
      setQRCodeData(data.base64); // Atualiza o QR code quando a resposta é recebida
      setTimer(0);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  };

  const checkInstanceStatus = useCallback(async () => {
    try {
      const instancesData = await fetchInstances();
      const updatedInstance = instancesData.find(inst => inst.name === instanceId);
      if (updatedInstance) {
        setInstance(updatedInstance);

        const status = updatedInstance.connectionStatus;
        
        if (status === "open") {
          setShowQRCode(false);
          setQRCodeData("");
        } else if (status === "close") {
          setTimer(prevTimer => {
            if (prevTimer >= 45) {
              handleConnect(instanceId);
              return 0;
            }
            return prevTimer + 10;
          });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    }
  }, [instanceId]);

  useEffect(() => {
    if (showQRCode) {
      const interval = setInterval(checkInstanceStatus, 10000); // Verifica a cada 10 segundos
      return () => clearInterval(interval);
    }
  }, [showQRCode, checkInstanceStatus]);

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
            <div className={`dashboard-status ${getStatusClass(instance.connectionStatus)}`}>
              <i className={`status-icon ${getStatusClass(instance.connectionStatus)}`}></i>
              <span className="status-text">{getStatusText(instance.connectionStatus)}</span>
            </div>
            <div className="dashboard-name">{instance.name}</div>
            {instance.connectionStatus === "close" && (
              <div className="connection-warning">
                <span>Telefone não conectado</span>
                <Button className="connect-button" onClick={() => handleConnect(instance.name)}>CONECTAR</Button>
              </div>
            )}
          </div>
          <div className="dashboard-actions">
            <Button 
              className="action-button" 
              onClick={handleRestart}
            >
              REINICIAR
            </Button>
            <Button 
              className={`action-button ${instance.connectionStatus === "close" ? "disabled" : ""}`} 
              onClick={() => handleLogout(instance.name)}
              disabled={instance.connectionStatus === "close"}
            >
              DESCONECTAR
            </Button>
          </div>
        </div>
=======
import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstance } from "@/contexts/InstanceContext";

function DashboardInstance() {
  const { instance } = useInstance();

  const renderStatus = (status: string | undefined) => {
    switch (status) {
      case "open":
        return (
          <div className="dashboard-status">
            <i className="status-icon connected"></i>
            <span className="status-text">CONECTADO</span>
          </div>
        );
      case "connecting":
        return (
          <div className="dashboard-status">
            <i className="status-icon connecting"></i>
            <span className="status-text">CONECTANDO</span>
          </div>
        );
      case "closed":
        return (
          <div className="dashboard-status">
            <i className="status-icon disconnected"></i>
            <span className="status-text">DESCONECTADO</span>
          </div>
        );
      default:
        return (
          <div className="dashboard-status">
            <i className="status-icon disconnected"></i>
            <span className="status-text">DESCONECTADO</span>
          </div>
        );
    }
  };

  return (
    <>
      <main className="dashboard-instance">
        <div className="dashboard-card">
          <div className="dashboard-info">
            {renderStatus(instance?.connectionStatus)}
            <div className="dashboard-name">{instance?.name}</div>
          </div>
          <div className="dashboard-actions">
            <Button className="action-button">REINICIAR</Button>
            <Button className="action-button disabled">DESCONECTAR</Button>
          </div>
        </div>
        <div className="connection-warning">
          <span>Telefone não conectado</span>
          <Button className="connect-button">CONECTAR</Button>
        </div>
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
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
<<<<<<< HEAD
      {showQRCode && (
        <QRCodePopup qrCodeData={qrCodeData} onClose={closeQRCodePopup} />
      )}
=======
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
    </>
  );
}

export { DashboardInstance };
