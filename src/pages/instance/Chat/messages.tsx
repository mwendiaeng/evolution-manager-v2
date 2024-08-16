import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  Paperclip,
  SparkleIcon,
  ZapIcon,
} from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

import { useInstance } from "@/contexts/InstanceContext";

import { findChat, findMessages } from "@/services/chat.service";

import { Chat, Message } from "@/types/evolution.types";

type MessagesProps = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  handleTextareaChange: () => void;
  textareaHeight: string;
  lastMessageRef: RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
};

function Messages({
  textareaRef,
  handleTextareaChange,
  textareaHeight,
  lastMessageRef,
  scrollToBottom,
}: MessagesProps) {
  const { instance } = useInstance();

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { remoteJid } = useParams<{
    remoteJid: string;
  }>();

  useEffect(() => {
    const fetchChat = async (instanceName: string, remoteJid: string) => {
      try {
        const data = await findChat(instanceName, remoteJid);
        setChat(data[0]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const fetchMsgs = async (instanceName: string, remoteJid: string) => {
      try {
        const data = await findMessages(instanceName, remoteJid);
        setMessages(data.messages.records);
        scrollToBottom();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (instance && remoteJid) {
      fetchChat(instance.name, remoteJid);
      fetchMsgs(instance.name, remoteJid);
    }
  }, [remoteJid, instance, scrollToBottom]);

  const renderBubbleRight = (message: Message) => {
    return (
      <div className="bubble-right">
        <div className="flex items-start gap-4 self-end">
          <div className="grid gap-1">
            <div className="prose text-muted-foreground">
              <div className="bubble">{JSON.stringify(message.message)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBubbleLeft = (message: Message) => {
    return (
      <div className="bubble-left">
        <div className="flex items-start gap-4">
          <div className="grid gap-1">
            <div className="prose text-muted-foreground">
              <div className="bubble">{JSON.stringify(message.message)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-1 rounded-xl px-3 text-lg data-[state=open]:bg-muted"
            >
              {chat?.pushName || chat?.remoteJid.split("@")[0]}
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-w-[300px]">
            <DropdownMenuItem className="items-start gap-2">
              <SparkleIcon className="mr-2 h-4 w-4 shrink-0 translate-y-1" />
              <div>
                <div className="font-medium">GPT-4</div>
                <div className="text-muted-foreground/80">
                  With DALL-E, browsing and analysis. Limit 40 messages / 3
                  hours
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="items-start gap-2">
              <ZapIcon className="mr-2 h-4 w-4 shrink-0 translate-y-1" />
              <div>
                <div className="font-medium">GPT-3</div>
                <div className="text-muted-foreground/80">
                  Great for everyday tasks
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="message-container mx-auto flex max-w-4xl flex-1 flex-col gap-8 overflow-y-auto px-4">
        {messages.map((message) => {
          if (message.key.fromMe) {
            return renderBubbleRight(message);
          } else {
            return renderBubbleLeft(message);
          }
        })}
        <div ref={lastMessageRef as never} />
      </div>
      <div className="sticky bottom-0 mx-auto flex w-full max-w-2xl flex-col gap-1.5 bg-background px-4 py-2">
        <div className="input-message relative">
          <Button
            type="button"
            size="icon"
            className="absolute bottom-3 left-3 h-8 w-8 rounded-full bg-transparent text-white hover:bg-transparent"
          >
            <Paperclip className="h-4 w-4 text-white" />
            <span className="sr-only">Anexar</span>
          </Button>
          <Textarea
            placeholder="Enviar mensagem..."
            name="message"
            id="message"
            rows={1}
            ref={textareaRef}
            onChange={handleTextareaChange}
            style={{ height: textareaHeight }}
            className="max-h-[240px] min-h-[48px] resize-none rounded-3xl border border-none p-4 pl-12 pr-16 shadow-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full"
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Messages };
