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
