import {
  CircleHelp,
  Cog,
  FileQuestion,
  IterationCcw,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Zap,
} from "lucide-react";

const Menus = [
  {
    id: "dashboard",
    title: "Visão Geral",
    icon: LayoutDashboard,
    path: "dashboard",
  },
  {
    navLabel: true,
    title: "Configurações",
    icon: Cog,
    children: [
      {
        id: "settings",
        title: "Comportamento",
        path: "settings",
      },
      {
        id: "proxy",
        title: "Proxy",
        path: "proxy",
      },
    ],
  },
  {
    title: "Callbacks",
    icon: IterationCcw,
    children: [
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
    ],
  },
  {
    title: "Integrações",
    icon: Zap,
    children: [
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
      {
        id: "openai",
        title: "OpenAI",
        path: "openai",
      },
      {
        id: "dify",
        title: "Dify",
        path: "dify",
      },
    ],
  },
  {
    id: "documentation",
    title: "Documentação",
    icon: FileQuestion,
    link: "https://doc.evolution-api.com",
    divider: true,
  },
  {
    id: "postman",
    title: "Postman",
    icon: CircleHelp,
    link: "https://evolution-api.com/postman",
  },
  {
    id: "discord",
    title: "Discord",
    icon: MessageCircle,
    link: "https://evolution-api.com/discord",
  },
  {
    id: "support-premium",
    title: "Support Premium",
    icon: LifeBuoy,
    link: "https://evolution-api.com/suporte-pro",
  },
] as const;

export default Menus;
