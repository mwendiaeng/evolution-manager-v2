import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardInstance() {
  return (
    <>
      <main className="dashboard-instance">
        <div className="dashboard-card">
          <div className="dashboard-info">
            <div className="dashboard-status">
              <i className="status-icon disconnected"></i>
              <span className="status-text">DESCONECTADO</span>
            </div>
            <div className="dashboard-name">InstanceName</div>
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
