export type NewInstance = {
  name: string;
  token?: string | null;
};

export type Instance = {
  id: string;
  name: string;
  token: string;
  webhook: string;
  rabbitmqEnable: string;
  websocketEnable: string;
  jid: string;
  qrcode: string;
  connected: boolean;
  expiration: number;
  events: string;
  os_name: string;
  proxy: string;
  client_name: string;
};

export type Webhook = {
  enabled: boolean;
  webhookUrl: string;
  subscribe: string[];
};
