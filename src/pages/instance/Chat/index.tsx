import "./style.css";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, PlusIcon } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Messages } from "./messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findChats } from "@/services/chat.service";
import { useInstance } from "@/contexts/InstanceContext";
import { Chat as ChatType } from "@/types/evolution.types";

function Chat() {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [textareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [chats, setChats] = useState([]);

  const { instance } = useInstance();

  const { instanceId, remoteJid } = useParams<{
    instanceId: string;
    remoteJid: string;
  }>();

  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = parseInt(
        getComputedStyle(textareaRef.current).lineHeight
      );
      const maxHeight = lineHeight * 10;
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
    }
  };

  useEffect(() => {
    const fetchData = async (instanceName: string) => {
      try {
        const data = await findChats(instanceName);
        setChats(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (instance) {
      fetchData(instance.name);
    }

    scrollToBottom();
  }, [instance]);

  const handleChat = (id: string) => {
    navigate(`/manager/instance/${instanceId}/chat/${id}`);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <div className="flex-col hidden gap-2 text-foreground bg-background md:flex">
          <div className="sticky top-0 p-2">
            <Button
              variant="ghost"
              className="justify-start w-full gap-2 px-2 text-left"
            >
              <div className="flex items-center justify-center rounded-full w-7 h-7">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="overflow-hidden text-sm grow text-ellipsis whitespace-nowrap">
                Chat
              </div>
              <PlusIcon className="w-4 h-4" />
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
                  {chats.map(
                    (chat: ChatType) =>
                      chat.remoteJid.includes("@s.whatsapp.net") && (
                        <Link
                          to="#"
                          onClick={() => handleChat(chat.remoteJid)}
                          className={`flex items-center block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item border-b border-gray-600/50 ${
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
                              className="w-8 h-8 rounded-full"
                            />
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="chat-title block font-medium">
                              {chat.pushName}
                            </span>
                            <span className="chat-description block text-xs text-gray-500">
                              {chat.remoteJid.split("@")[0]}
                            </span>
                          </div>
                        </Link>
                      )
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="flex-1 overflow-auto">
                <div className="grid gap-1 p-2 text-foreground">
                  {chats.map(
                    (chat: ChatType) =>
                      chat.remoteJid.includes("@g.us") && (
                        <Link
                          to="#"
                          onClick={() => handleChat(chat.remoteJid)}
                          className={`flex items-center block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item border-b border-gray-600/50 ${
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
                              className="w-8 h-8 rounded-full"
                            />
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="chat-title block font-medium">
                              {chat.pushName}
                            </span>
                            <span className="chat-description block text-xs text-gray-500">
                              {chat.remoteJid}
                            </span>
                          </div>
                        </Link>
                      )
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
