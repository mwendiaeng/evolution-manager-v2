export type Settings = {
  id?: string;
  rejectCall: boolean;
  msgCall?: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
  createdAt?: string;
  updatedAt?: string;
  instanceId?: string;
};

export type NewInstance = {
  instanceName: string;
  qrcode?: boolean;
  integration: string;
  token?: string;
  number?: string;
};

export type Instance = {
  id: string;
  name: string;
  connectionStatus: string;
  ownerJid: string;
  profileName: string;
  profilePicUrl: string;
  integration: string;
  number: string;
  businessId: string;
  token: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  Setting: Settings;
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

export type OpenaiCreds = {
  id?: string;
  name: string;
  apiKey: string;
};

export type OpenaiBot = {
  id?: string;
  openaiCredsId: string;
  enabled: boolean;
  botType: string;
  assistantId: string;
  model: string;
  systemMessages: string;
  assistantMessages: string;
  userMessages: string;
  maxTokens: number;
  triggerType: string;
  triggerOperator: string;
  triggerValue: string;
  expire: number;
  keywordFinish: string;
  delayMessage: number;
  unknownMessage: string;
  listeningFromMe: boolean;
  stopBotFromMe: boolean;
  keepOpen: boolean;
  debounceTime: number;
  ignoreJids?: string[];
};

export type Typebot = {
  id?: string;
  enabled: boolean;
  url: string;
  typebot: string;
  triggerType: string;
  triggerOperator: string;
  triggerValue: string;
  expire: number;
  keywordFinish: string;
  delayMessage: number;
  unknownMessage: string;
  listeningFromMe: boolean;
  stopBotFromMe: boolean;
  keepOpen: boolean;
  debounceTime: number;
};
