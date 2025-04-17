export type Settings = {
  id?: string;
  reject_call: boolean;
  msg_call?: string;
  groups_ignore: boolean;
  always_online: boolean;
  read_messages: boolean;
  read_status: boolean;
  sync_full_history: boolean;
  createdAt?: string;
  updatedAt?: string;
  instanceId?: string;
};

export type NewInstance = {
  instanceName: string;
  qrcode?: boolean;
  integration: string;
  token?: string | null;
  number?: string | null;
  businessId?: string | null;
};

export type Instance = {
  instanceId: string;
  instanceName: string;
  status: string;
  integration: string;
  number: string;
  token: string;
  apikey: string;
  createdAt: string;
  updatedAt: string;
  Setting: Settings;
  _count?: {
    Message?: number;
    Contact?: number;
    Chat?: number;
  };
};

export type Contact = {
  id: string;
  pushName: string;
  remoteJid: string;
  profilePicUrl: string;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
};

export type Chat = {
  id: string;
  pushName: string;
  remoteJid: string;
  labels: string[] | null;
  profilePicUrl: string;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
};

export type Key = {
  id: string;
  fromMe: boolean;
  remoteJid: string;
};

export type Message = {
  id: string;
  key: Key;
  pushName: string;
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
  messageTimestamp: string;
  instanceId: string;
  source: string;
};

export type IntegrationSession = {
  id?: string;
  remoteJid: string;
  pushName: string;
  sessionId: string;
  status: string;
  awaitUser: boolean;
  createdAt: string;
  updatedAt: string;
  botId: string;
};

export type Typebot = {
  id?: string;
  enabled: boolean;
  url: string;
  typebot: string;
  expire: number;
  keyword_finish: string;
  delay_message: number;
  unknown_message: string;
  listening_from_me: boolean;
};

export type Webhook = {
  id?: string;
  enabled: boolean;
  url: string;
  events: string[];
  webhook_base64: boolean;
  webhook_by_events: boolean;
};

export type Websocket = {
  id?: string;
  enabled: boolean;
  events: string[];
};

export type Rabbitmq = {
  id?: string;
  enabled: boolean;
  events: string[];
};

export type Sqs = {
  id?: string;
  enabled: boolean;
  events: string[];
};

export type ProxyType = {
  host: string;
  port: string;
  protocol: string;
  username?: string;
  password?: string;
};

export type Proxy = {
  id?: string;
  enabled: boolean;
  proxy: ProxyType;
};

export type Chatwoot = {
  id?: string;
  enabled: boolean;
  account_id: string;
  token: string;
  url: string;
  sign_msg: boolean;
  sign_delimiter: string;
  reopen_conversation: boolean;
  conversation_pending: boolean;
  import_contacts: boolean;
  import_messages: boolean;
  days_limit_import_messages: number;
  auto_create: boolean;
};
