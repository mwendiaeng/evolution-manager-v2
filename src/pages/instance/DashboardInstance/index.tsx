import { Button } from "@/components/ui/button";
import "./style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

function DashboardInstance() {
  const chartData = [
    { month: "January", send: 186, received: 80 },
    { month: "February", send: 305, received: 200 },
    { month: "March", send: 237, received: 120 },
    { month: "April", send: 73, received: 190 },
    { month: "May", send: 209, received: 130 },
    { month: "June", send: 214, received: 140 },
  ];

  const chartConfig = {
    send: {
      label: "Enviadas",
      color: "#29a269",
    },
    received: {
      label: "Recebidas",
      color: "#42b3c2",
    },
  } satisfies ChartConfig;

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
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Bar dataKey="send" fill="var(--color-send)" radius={4} />
          <Bar dataKey="received" fill="var(--color-received)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  );
}

export { DashboardInstance };
