import { Cog, LayoutDashboard } from "lucide-react";

const Menus = [
  {
    id: "dashboard",
    title: "Visão Geral",
    icon: LayoutDashboard,
    path: "dashboard",
  },
  // {
  //   id: "chat",
  //   title: "Chat",
  //   icon: MessageCircle,
  //   path: "chat",
  // },
  {
    navLabel: true,
    title: "Configurações",
    icon: Cog,
  },
  {
    id: "settings",
    title: "Comportamento",
    path: "settings",
  },
  {
    id: "openai",
    title: "OpenAI",
    path: "openai",
  },
  {
    id: "webhook",
    title: "Webhook",
    path: "webhook",
  },
  {
    id: "websocket",
    title: "Websocket",
    path: "websocket",
  },
  {
    id: "rabbitmq",
    title: "RabbitMQ",
    path: "rabbitmq",
  },
  {
    id: "sqs",
    title: "Amazon SQS",
    path: "sqs",
  },
  {
    id: "chatwoot",
    title: "Chatwoot",
    path: "chatwoot",
  },
  {
    id: "typebot",
    title: "Typebot",
    path: "typebot",
  },
];

export default Menus;
