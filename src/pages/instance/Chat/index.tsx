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

function Chat() {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [textareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { instanceId, chatId } = useParams<{
    instanceId: string;
    chatId: string;
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
    scrollToBottom();
  }, []);

  const handleChat = (id: string) => {
    navigate(`/instance/${instanceId}/chat/${id}`);
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
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item active"
                  >
                    Davidson Gomes - 557499879409
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Davidson Gomes - 557499879409
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Davidson Gomes - 557499879409
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Davidson Gomes - 557499879409
                  </Link>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="flex-1 overflow-auto">
                <div className="grid gap-1 p-2 text-foreground">
                  <div className="px-2 text-xs font-medium text-muted-foreground">
                    Grupos
                  </div>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Evolution API - 123456789@g.us
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Evolution API - 123456789@g.us
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Evolution API - 123456789@g.us
                  </Link>
                  <Link
                    to="#"
                    onClick={() => handleChat("557499879409")}
                    className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50 chat-item"
                  >
                    Evolution API - 123456789@g.us
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="border border-black" />
      <ResizablePanel>
        {chatId && (
          <Messages
            textareaRef={textareaRef}
            handleTextareaChange={handleTextareaChange}
            textareaHeight={textareaHeight}
            lastMessageRef={lastMessageRef}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export { Chat };
