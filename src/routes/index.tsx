import ProtectedRoute from "@/components/providers/protected-route";
import PublicRoute from "@/components/providers/public-route";
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
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/dashboard",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <DashboardInstance />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/chat",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Chat />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/chat/:chatId",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Chat />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/settings",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Settings />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/openai",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Openai />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/webhook",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Webhook />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/websocket",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Websocket />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/rabbitmq",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Rabbitmq />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/sqs",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Sqs />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/chatwoot",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Chatwoot />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "instance/:instanceId/typebot",
    element: (
      <ProtectedRoute>
        <InstanceLayout>
          <Typebot />
        </InstanceLayout>
      </ProtectedRoute>
    ),
  },
]);

export default router;
