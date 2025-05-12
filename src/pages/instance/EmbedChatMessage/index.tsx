/* eslint-disable @typescript-eslint/no-explicit-any */
// Importação do arquivo de estilo
import "./style.css";
// import axios from "axios";
import { MessageCircle, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
// Importações de bibliotecas externas
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
// Importações de componentes da aplicação
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importações de contextos
import { useEmbedColors } from "@/contexts/EmbedColorsContext";
import { useEmbedInstance } from "@/contexts/EmbedInstanceContext";
import { ReplyMessageProvider } from "@/contexts/ReplyingMessage/ReplyingMessageContext";
// import { useWebphone } from "@/contexts/Webphone";

import { api } from "@/lib/queries/api";

import { TOKEN_ID, getToken } from "@/lib/queries/token";

// import { connectSocket, disconnectSocket } from "@/services/websocket/socket";

import { Contact, Instance, Message } from "@/types/evolution.types";

// Importações de utilitários
import { formatRemoteJid } from "@/utils/format-remoteJid";
import { useMediaQuery } from "@/utils/useMediaQuery";

// Importações de componentes locais
import { InputMessage } from "./InputMessage";
import { Messages } from "./Messages";
import { NewChat } from "./NewChat";

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    dateStyle: undefined,
  });
}

function getLastMessagePreview(message: any, t: any) {
  if (!message) return t("chat.noMessage");
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text)
    return message.extendedTextMessage.text;
  if (message.buttonsResponseMessage) return t("chat.messageTypes.interactive");
  if (message.imageMessage) return t("chat.messageTypes.image");
  if (message.videoMessage) return t("chat.messageTypes.video");
  if (message.audioMessage) return t("chat.messageTypes.audio");
  if (message.documentMessage) return t("chat.messageTypes.document");
  if (message.stickerMessage) return t("chat.messageTypes.sticker");
  if (message.contactMessage) return t("chat.messageTypes.contact");
  if (message.locationMessage) return t("chat.messageTypes.location");
  return t("chat.noMessage");
}

function EmbedChatMessage() {
  const [searchParams] = useSearchParams();
  const { backgroundColor, textForegroundColor, primaryColor } =
    useEmbedColors();

  const isNotMobile = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token");

  const remoteJid = searchParams.get("remoteJid");

  const [chats, setChats] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  // const { setIsOpen, makeCall } = useWebphone();

  const { instance: activeInstance } = useEmbedInstance();

  const handleChatClick = (chat: Contact) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("remoteJid", chat.id);
    navigate(`/manager/embed-chat?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!activeInstance?.instanceName) return;

      try {
        const { data } = await api.get(
          `/chat/fetchContactsWithLastMessage/${activeInstance.instanceName}`,
          {
            headers: {
              apikey: tokenFromUrl || activeInstance.token,
            },
          },
        );
        setChats(data || []);
      } catch (error) {
        console.error("Erro ao buscar chats:", error);
        toast.error("Erro ao buscar chats");
      }
    };
    fetchChats();
  }, [activeInstance, activeInstance?.instanceName, tokenFromUrl]);

  useEffect(() => {
    if (!activeInstance?.instanceName) return;

    const interval = setInterval(() => {
      const fetchChats = async () => {
        try {
          const { data } = await api.get(
            `/chat/fetchContactsWithLastMessage/${activeInstance.instanceName}`,
            {
              headers: {
                apikey: tokenFromUrl || activeInstance.token,
              },
            },
          );
          setChats(data || []);
        } catch (error) {
          console.error("Erro ao buscar chats:", error);
          toast.error("Erro ao buscar chats");
        }
      };
      fetchChats();

      if (remoteJid) {
        const fetchMessages = async () => {
          try {
            const { data } = await api.post(
              `/chat/findMessages/${activeInstance.instanceName}`,
              {
                where: { key: { remoteJid } },
              },
            );
            setMessages(data || []);
          } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
            toast.error("Erro ao buscar mensagens");
          }
        };
        fetchMessages();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeInstance, activeInstance?.instanceName, tokenFromUrl]);

  useEffect(() => {
    if (!activeInstance) return;

    const serverUrl = getToken(TOKEN_ID.API_URL);

    if (!serverUrl) return;

    const currentToken = localStorage.getItem("accessToken");

    if (tokenFromUrl) {
      localStorage.setItem("accessToken", tokenFromUrl);
    }

    // const socket = connectSocket(serverUrl);

    // function updateChats(event: string, data: any) {
    //   if (!activeInstance) return;

    //   if (data.instance !== activeInstance.instanceName) return;

    //   setChats((prevChats) => {
    //     const existingChatIndex = prevChats.findIndex(
    //       (chat) => chat.remoteJid === data?.data?.key?.remoteJid,
    //     );

    //     const getChat = prevChats.find(
    //       (chat) => chat.remoteJid === data?.data?.key?.remoteJid,
    //     );

    //     const chatObject: ChatType = {
    //       id: data?.data?.key?.remoteJid,
    //       remoteJid:
    //         event === "send.message"
    //           ? getChat?.remoteJid
    //           : data?.data?.key?.remoteJid,
    //       pushName:
    //         event === "send.message"
    //           ? getChat?.pushName
    //           : data?.data?.pushName || data?.data?.key?.remoteJid,
    //       profilePicUrl:
    //         event === "send.message"
    //           ? getChat?.profilePicUrl
    //           : data?.data?.key?.profilePicUrl,
    //       lastMessage: data?.data,
    //       updatedAt: new Date().toISOString(),
    //       labels: [],
    //       createdAt: new Date().toISOString(),
    //       instanceName: activeInstance.instanceName,
    //       windowStart: data?.data?.chat?.windowStart,
    //       windowExpires: data?.data?.chat?.windowExpires,
    //       windowActive: data?.data?.chat?.windowActive,
    //     };

    //     if (existingChatIndex !== -1) {
    //       const updatedChats = [...prevChats];
    //       updatedChats[existingChatIndex] = {
    //         ...updatedChats[existingChatIndex],
    //         ...chatObject,
    //       };
    //       return updatedChats;
    //     } else {
    //       return [...prevChats, chatObject];
    //     }
    //   });
    // }

    // function updateMessages(data: any) {
    //   if (
    //     data.instance !== activeInstance?.instanceName ||
    //     data.data.key.remoteJid !== remoteJid
    //   )
    //     return;

    //   const { data: message } = data;

    //   setMessages((prevMessages) => [...prevMessages, message]);
    // }

    // function updateMessageStatus(data: any) {
    //   const { data: message } = data;

    //   setMessages((prevMessages) => {
    //     const messageIndex = prevMessages.findIndex(
    //       (msg) => msg.key.id === message.keyId,
    //     );

    //     if (messageIndex === -1) return prevMessages;

    //     const updatedMessages = [...prevMessages];
    //     updatedMessages[messageIndex] = {
    //       ...updatedMessages[messageIndex],
    //       messageUpdate: [
    //         ...(updatedMessages[messageIndex].messageUpdate ?? []),
    //         { status: message.status },
    //       ],
    //     };

    //     return updatedMessages;
    //   });
    // }

    // socket.on("messages.upsert", (data: any) => {
    //   updateMessages(data);
    //   updateChats("messages.upsert", data);
    // });

    // socket.on("send.message", (data: any) => {
    //   updateMessages(data);
    //   updateChats("send.message", data);
    // });

    // socket.on("messages.update", (data: any) => {
    //   updateMessageStatus(data);
    // });

    // socket.connect();

    return () => {
      // socket.off("messages.upsert");
      // socket.off("send.message");
      // socket.off("messages.update");
      // disconnectSocket(socket);

      if (tokenFromUrl) {
        localStorage.setItem("accessToken", currentToken || "");
      } else {
        localStorage.removeItem("accessToken");
      }
    };
  }, [activeInstance, remoteJid, tokenFromUrl]);

  useEffect(() => {
    if (remoteJid) {
      const currentChat = chats.find((chat) => chat.id === remoteJid);
      setSelectedChat(currentChat || null);
    }
  }, [remoteJid, chats]);

  // const handleCallClick = () => {
  //   if (!selectedChat?.remoteJid) return;

  //   setIsOpen(true);
  //   makeCall(selectedChat.remoteJid);
  // };

  const containerStyle = {
    backgroundColor,
    color: textForegroundColor,
  };

  return (
    <div className="relative h-full" style={containerStyle}>
      <ResizablePanelGroup direction={isNotMobile ? "horizontal" : "vertical"}>
        <ResizablePanel defaultSize={30} minSize={20} maxSize={60}>
          <div
            className="hidden flex-col gap-2 text-foreground md:flex"
            style={containerStyle}
          >
            <div className="sticky top-0 p-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 text-left"
                onClick={() => setIsNewChatDialogOpen(true)}
                style={{
                  backgroundColor: primaryColor,
                  color: textForegroundColor,
                }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                  {t("chat.title")}
                </div>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <Tabs defaultValue="contacts">
              <TabsList className="tabs-chat">
                <TabsTrigger
                  value="contacts"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  style={
                    {
                      "--primary": primaryColor || "#e2e8f0",
                      "--primary-foreground": textForegroundColor || "#000000",
                    } as React.CSSProperties
                  }
                >
                  {t("chat.contacts")}
                </TabsTrigger>
                <TabsTrigger
                  value="groups"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  style={
                    {
                      "--primary": primaryColor || "#e2e8f0",
                      "--primary-foreground": textForegroundColor || "#000000",
                    } as React.CSSProperties
                  }
                >
                  {t("chat.groups")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contacts">
                <div className="contacts-container">
                  <div className="grid gap-1 p-2 text-foreground">
                    <div className="px-2 text-xs font-medium text-muted-foreground">
                      {t("chat.contacts")}
                    </div>
                    {chats
                      ?.sort(
                        (a: any, b: any) =>
                          new Date(b.lastMessage.messageTimestamp).getTime() -
                          new Date(a.lastMessage.messageTimestamp).getTime(),
                      )
                      .map(
                        (chat: Contact) =>
                          chat?.id &&
                          !chat.id.includes("@g.us") && (
                            <div
                              key={chat.id}
                              onClick={() => handleChatClick(chat)}
                              className={`chat-item flex cursor-pointer items-center overflow-hidden rounded-md p-2 text-sm transition-colors`}
                              style={{
                                backgroundColor:
                                  remoteJid === chat.id ? primaryColor : "",
                              }}
                            >
                              <span className="chat-avatar mr-2">
                                <img
                                  src={
                                    chat.profilePictureUrl ||
                                    "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                                  }
                                  alt="Avatar"
                                  className="h-12 w-12 rounded-full"
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span
                                    className="chat-title font-medium"
                                    style={{ color: textForegroundColor }}
                                  >
                                    {chat.pushName || formatRemoteJid(chat.id)}
                                  </span>
                                  <span
                                    className="text-xs"
                                    style={{ color: textForegroundColor }}
                                  >
                                    {chat.lastMessage &&
                                      formatTimestamp(
                                        chat.lastMessage.messageTimestamp,
                                      )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {chat.lastMessage?.key?.fromMe ? (
                                    <span
                                      className="text-xs font-bold"
                                      style={{ color: textForegroundColor }}
                                    >
                                      {t("chat.sent")}:{" "}
                                    </span>
                                  ) : (
                                    <span
                                      className="text-xs font-bold"
                                      style={{ color: textForegroundColor }}
                                    >
                                      {t("chat.received")}:{" "}
                                    </span>
                                  )}
                                  <span
                                    className="block truncate text-xs"
                                    style={{ color: textForegroundColor }}
                                  >
                                    {getLastMessagePreview(
                                      chat.lastMessage?.message,
                                      t,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ),
                      )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="groups">
                <div className="contacts-container">
                  <div className="grid gap-1 p-2 text-foreground">
                    <div className="px-2 text-xs font-medium text-muted-foreground">
                      {t("chat.groups")}
                    </div>
                    {chats
                      ?.sort(
                        (a: any, b: any) =>
                          new Date(b.lastMessage.messageTimestamp).getTime() -
                          new Date(a.lastMessage.messageTimestamp).getTime(),
                      )
                      .map(
                        (chat: Contact) =>
                          chat?.id &&
                          chat.id.includes("@g.us") && (
                            <div
                              key={chat.id}
                              onClick={() => handleChatClick(chat)}
                              className={`chat-item flex cursor-pointer items-center overflow-hidden rounded-md p-2 text-sm transition-colors`}
                              style={{
                                backgroundColor:
                                  remoteJid === chat.id ? primaryColor : "",
                              }}
                            >
                              <span className="chat-avatar mr-2">
                                <img
                                  src={
                                    chat.profilePictureUrl ||
                                    "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                                  }
                                  alt="Avatar"
                                  className="h-12 w-12 rounded-full"
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="chat-title font-medium">
                                    {chat.pushName}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {chat.lastMessage &&
                                      formatTimestamp(
                                        chat.lastMessage.messageTimestamp,
                                      )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {chat.lastMessage?.fromMe ? (
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                      {t("chat.sent")}{" "}
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                      {t("chat.received")}{" "}
                                    </span>
                                  )}
                                  <span className="block truncate text-xs text-gray-500">
                                    {getLastMessagePreview(
                                      chat.lastMessage?.message,
                                      t,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ),
                      )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel style={containerStyle}>
          {remoteJid && (
            <ReplyMessageProvider>
              <div
                className="flex h-full flex-col justify-between"
                style={containerStyle}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="flex flex-1 items-center gap-3">
                    <img
                      src={
                        selectedChat?.profilePictureUrl ||
                        "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                      }
                      alt="Avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {selectedChat?.pushName || formatRemoteJid(remoteJid)}
                      </span>
                    </div>
                  </div>
                </div>

                <Messages
                  remoteJid={remoteJid}
                  instance={activeInstance as Instance}
                  messages={messages}
                  setMessages={setMessages}
                />

                <InputMessage chat={selectedChat as Contact} />
              </div>
            </ReplyMessageProvider>
          )}
          <NewChat
            isOpen={isNewChatDialogOpen}
            setIsOpen={setIsNewChatDialogOpen}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export { EmbedChatMessage };
