/* eslint-disable @typescript-eslint/no-explicit-any */

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

type MessageKey = {
  id: string;
  fromMe: boolean;
  remoteJid: string;
  participant: string | null;
  profilePicUrl?: string;
  participantPushName?: string | null;
};

type LastMessage = {
  key?: MessageKey;
  fromMe: boolean;
  messageTimestamp: number;
  pushName: string;
  participant: string | null;
  messageType: string;
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    buttonsResponseMessage?: any;
    messageContextInfo?: {
      messageSecret: string;
      deviceListMetadata: {
        senderKeyHash: string;
        senderTimestamp: number;
        recipientKeyHash: string;
        senderAccountType: number;
        recipientTimestamp: number;
        receiverAccountType: number;
      };
      deviceListMetadataVersion: number;
    };
    stickerMessage?: any;
    documentMessage?: any;
    imageMessage?: any;
    videoMessage?: any;
    audioMessage?: any;
    contactMessage?: any;
    locationMessage?: any;
  };
  contextInfo: any | null;
  source: string;
  instanceId: string;
  sessionId: string | null;
  status: string;
};

export type Contact = {
  id: string;
  pushName: string;
  profilePictureUrl: string;
  lastMessage?: LastMessage;
};

export type Chat = {
  id: string;
  pushName: string;
  push_name?: string;
  remoteJid: string;
  remote_jid?: string;
  labels: string[] | null;
  profilePicUrl: string;
  profile_pic_url?: string;
  createdAt: string;
  updatedAt: string;
  instanceName: string;
  unreadMessages?: number;
  lastMessage?: LastMessage;
  windowStart?: string;
  windowExpires?: string;
  windowActive?: boolean;
};

export type Key = {
  id: string;
  fromMe: boolean;
  remoteJid: string;
  profilePicUrl?: string;
  participant?: string;
  participantPushName?: string;
};

export type Message = {
  viewOnceMessage?: any;
  id: string;
  key: Key;
  pushName: string;
  messageType: string;
  contextInfo?: {
    stanzaId: string;
    participant: string;
    quotedMessage: {
      imageMessage?: {
        jpegThumbnail: string;
        caption?: string;
      };
      videoMessage?: {
        jpegThumbnail: string;
        caption?: string;
      };
      audioMessage?: {
        url: string;
        mimetype: string;
        fileEncSha256: string;
        fileLength: string;
        seconds: number;
      };
      documentMessage?: {
        fileName: string;
      };
      documentWithCaptionMessage?: {
        message: {
          documentMessage: {
            fileName: string;
            caption: string;
          };
        };
      };
      contactMessage?: {
        displayName: string;
        vcard: string;
      };
      locationMessage?: {
        degreesLatitude: number;
        degreesLongitude: number;
        name: string;
        address: string;
      };
      extendedTextMessage?: string;
      conversation?: string;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
  messageTimestamp: string;
  instanceId: string;
  source: string;
  messageUpdate?: {
    status: string;
  }[];
  reactions?: {
    emoji: string;
    sender: string;
    messageId: string;
    timestamp: number;
  }[];
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

export type DeleteMessage = {
  id: string;
  remoteJid: string;
  fromMe: boolean;
  participant?: string;
};

export type SendText = {
  number: string;
  options?: {
    delay?: number;
    presence?: string;
    linkPreview?: boolean;
    quoted?: any;
    mentions?: {
      everyOne?: boolean;
      mentioned?: string[];
    };
  };
  textMessage: {
    text: string;
  };
};

export type SendMedia = {
  number: string;
  options?: {
    delay?: number;
    presence?: string;
    linkPreview?: boolean;
    quoted?: any;
    mentions?: {
      everyOne?: boolean;
      mentioned?: string[];
    };
  };
  mediaMessage: {
    mediatype: string;
    mimetype: string;
    caption?: string;
    media?: File | string;
    fileName: string;
  };
};

export type SendAudio = {
  number: string;
  options?: {
    delay?: number;
    presence?: string;
    encoding?: boolean;
    quoted?: any;
    mentions?: {
      everyOne?: boolean;
      mentioned?: string[];
    };
  };
  audioMessage: {
    audio: File | string;
  };
};
