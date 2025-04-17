import "./style.css";
import { MessageCircle, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useInstance } from "@/contexts/InstanceContext";

import { useFindChats } from "@/lib/queries/chat/findChats";

import { Chat as ChatType } from "@/types/evolution.types";

import { useMediaQuery } from "@/utils/useMediaQuery";

import { Messages } from "./messages";

function Chat() {
  const isMD = useMediaQuery("(min-width: 768px)");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [textareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { instance } = useInstance();

  const { data: chats, isSuccess } = useFindChats({
    instanceName: instance?.instanceName,
  });

  const { instanceId, remoteJid } = useParams<{
    instanceId: string;
    remoteJid: string;
  }>();

  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  }, []);

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = parseInt(
        getComputedStyle(textareaRef.current).lineHeight,
      );
      const maxHeight = lineHeight * 10;
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight,
      )}px`;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      scrollToBottom();
    }
  }, [isSuccess, scrollToBottom]);

  const handleChat = (id: string) => {
    navigate(`/manager/instance/${instanceId}/chat/${id}`);
  };

  return (
    <ResizablePanelGroup direction={isMD ? "horizontal" : "vertical"}>
      <ResizablePanel defaultSize={20}>
        <div className="hidden flex-col gap-2 bg-background text-foreground md:flex">
          <div className="sticky top-0 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-2 text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                Chat
              </div>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <Tabs defaultValue="contacts">
            <TabsList className="tabs-chat">
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="groups">Grupos</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts">
              <div className="flex-1 overflow-auto">
                <div className="grid gap-1 p-2 text-foreground">
                  <div className="px-2 text-xs font-medium text-muted-foreground">
                    Contatos
                  </div>
                  {chats?.map(
                    (chat: ChatType) =>
                      chat.remoteJid.includes("@s.whatsapp.net") && (
                        <Link
                          key={chat.id}
                          to="#"
                          onClick={() => handleChat(chat.remoteJid)}
                          className={`chat-item flex items-center overflow-hidden truncate whitespace-nowrap rounded-md border-b border-gray-600/50 p-2 text-sm transition-colors hover:bg-muted/50 ${
                            remoteJid === chat.remoteJid ? "active" : ""
                          }`}
                        >
                          <span className="chat-avatar mr-2">
                            <img
                              src={
                                chat.profilePicUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt="Avatar"
                              className="h-8 w-8 rounded-full"
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="chat-title block font-medium">
                              {chat.pushName}
                            </span>
                            <span className="chat-description block text-xs text-gray-500">
                              {chat.remoteJid.split("@")[0]}
                            </span>
                          </div>
                        </Link>
                      ),
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="flex-1 overflow-auto">
                <div className="grid gap-1 p-2 text-foreground">
                  {chats?.map(
                    (chat: ChatType) =>
                      chat.remoteJid.includes("@g.us") && (
                        <Link
                          key={chat.id}
                          to="#"
                          onClick={() => handleChat(chat.remoteJid)}
                          className={`chat-item flex items-center overflow-hidden truncate whitespace-nowrap rounded-md border-b border-gray-600/50 p-2 text-sm transition-colors hover:bg-muted/50 ${
                            remoteJid === chat.remoteJid ? "active" : ""
                          }`}
                        >
                          <span className="chat-avatar mr-2">
                            <img
                              src={
                                chat.profilePicUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt="Avatar"
                              className="h-8 w-8 rounded-full"
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="chat-title block font-medium">
                              {chat.pushName}
                            </span>
                            <span className="chat-description block text-xs text-gray-500">
                              {chat.remoteJid}
                            </span>
                          </div>
                        </Link>
                      ),
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="border border-black" />
      <ResizablePanel>
        {remoteJid && (
          <Messages
            textareaRef={textareaRef}
            handleTextareaChange={handleTextareaChange}
            textareaHeight={textareaHeight}
            lastMessageRef={lastMessageRef}
            scrollToBottom={scrollToBottom}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export { Chat };
