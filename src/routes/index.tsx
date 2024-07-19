import { InstanceLayout } from "@/layout/InstanceLayout";
import { MainLayout } from "@/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import { Chat } from "@/pages/instance/Chat";
import { Chatwoot } from "@/pages/instance/Chatwoot";
import { DashboardInstance } from "@/pages/instance/DashboardInstance";
import { Openai } from "@/pages/instance/Openai";
import { Rabbitmq } from "@/pages/instance/Rabbitmq";
import { Settings } from "@/pages/instance/Settings";
import { Sqs } from "@/pages/instance/Sqs";
import { Typebot } from "@/pages/instance/Typebot";
import { Webhook } from "@/pages/instance/Webhook";
import { Websocket } from "@/pages/instance/Websocket";
import Login from "@/pages/Login";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: "instance/:instanceId/dashboard",
    element: (
      <InstanceLayout>
        <DashboardInstance />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/chat",
    element: (
      <InstanceLayout>
        <Chat />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/chat/:chatId",
    element: (
      <InstanceLayout>
        <Chat />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/settings",
    element: (
      <InstanceLayout>
        <Settings />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/openai",
    element: (
      <InstanceLayout>
        <Openai />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/webhook",
    element: (
      <InstanceLayout>
        <Webhook />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/websocket",
    element: (
      <InstanceLayout>
        <Websocket />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/rabbitmq",
    element: (
      <InstanceLayout>
        <Rabbitmq />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/sqs",
    element: (
      <InstanceLayout>
        <Sqs />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/chatwoot",
    element: (
      <InstanceLayout>
        <Chatwoot />
      </InstanceLayout>
    ),
  },
  {
    path: "instance/:instanceId/typebot",
    element: (
      <InstanceLayout>
        <Typebot />
      </InstanceLayout>
    ),
  },
]);

export default router;
