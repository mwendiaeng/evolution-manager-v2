import { CircleHelp, Cog, FileQuestion, LayoutDashboard, LifeBuoy, MessageCircle } from "lucide-react";

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
  {
    id: "proxy",
    title: "Proxy",
    path: "proxy",
  },
  {
    id: "documentation",
    title: "Documentação",
    icon: FileQuestion,
    link: "https://doc.evolution-api.com",
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
];

export default Menus;
