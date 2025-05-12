import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
// Importações de contextos

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useEmbedColors } from "@/contexts/EmbedColorsContext";

import { useFindChat } from "@/lib/queries/chat/findChat";
import { useFindMessages } from "@/lib/queries/chat/findMessages";

import { Instance, Message } from "@/types/evolution.types";

// Importações de componentes locais
import { MessageBubble } from "./message-bubble";
import { MessageContent } from "./message-content";
import { MessageOptions } from "./message-options";

interface MessagesProps {
  remoteJid: string;
  instance: Instance;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}
const Messages = ({
  remoteJid,
  instance,
  messages,
  setMessages,
}: MessagesProps) => {
  const { backgroundColor, textForegroundColor } = useEmbedColors();

  const containerStyle = {
    backgroundColor,
    color: textForegroundColor,
  };

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { data: chat } = useFindChat({
    remoteJid,
    instanceName: instance?.instanceName,
    enabled: !!instance?.instanceName && !!remoteJid,
  });

  const {
    data: initialMessages,
    isSuccess,
    isLoading,
  } = useFindMessages({
    remoteJid,
    instanceName: instance?.instanceName,
    enabled: !!instance?.instanceName && !!remoteJid,
  });

  useEffect(() => {
    if (isSuccess && initialMessages) {
      setMessages(initialMessages);
    }
  }, [isSuccess, initialMessages, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const checkIfIsDeleted = (message: Message) => {
    const { messageUpdate } = message;
    if (!messageUpdate || !Array.isArray(messageUpdate)) return false;
    return messageUpdate.map((update) => update.status).includes("DELETED");
  };

  // Função auxiliar para processar as reações
  const processWhatsmeowMessagesWithReactions = (messages: Message[]) => {
    const processedMessages = [...messages];

    // Primeiro vamos agrupar todas as mensagens de reação por ID da mensagem original
    const reactionsByMessageId = messages.reduce(
      (acc, message) => {
        if (message.message?.reactionMessage) {
          const targetMessageId = message.message.reactionMessage.key.ID;
          if (!acc[targetMessageId]) {
            acc[targetMessageId] = [];
          }
          acc[targetMessageId].push({
            message,
            timestamp: message.message.reactionMessage.senderTimestampMS,
          });
        }
        return acc;
      },
      {} as Record<string, Array<{ message: Message; timestamp: number }>>,
    );

    // Para cada grupo de reações, pegamos apenas a última
    Object.entries(reactionsByMessageId).forEach(
      ([targetMessageId, reactions]) => {
        const targetMessageIndex = processedMessages.findIndex(
          (msg) => msg.key.id === targetMessageId,
        );

        if (targetMessageIndex !== -1) {
          // Ordena por timestamp e pega a última reação
          const lastReaction = reactions.sort(
            (a, b) => b.timestamp - a.timestamp,
          )[0];

          // Se a última reação tem texto, adiciona. Se não tem, remove a reação
          if (lastReaction.message.message?.reactionMessage.text) {
            processedMessages[targetMessageIndex] = {
              ...processedMessages[targetMessageIndex],
              reactions: [
                {
                  emoji: lastReaction.message.message.reactionMessage.text,
                  sender: lastReaction.message.pushName,
                  messageId: lastReaction.message.key.id,
                  timestamp: lastReaction.timestamp,
                },
              ],
            };
          } else {
            // Se a última "reação" não tem texto, significa que foi uma remoção
            processedMessages[targetMessageIndex] = {
              ...processedMessages[targetMessageIndex],
              reactions: [],
            };
          }
        }
      },
    );

    // Remove as mensagens que são apenas reações
    return processedMessages.filter(
      (message) => !message.message?.reactionMessage,
    );
  };

  const processOfficialMessagesWithReactions = (messages: Message[]) => {
    const processedMessages = [...messages];

    const reactionsByMessageId = messages.reduce(
      (acc, message) => {
        if (message.messageType === "reactionMessage") {
          const targetMessageId = message.message.reactionMessage.key.id;
          if (!acc[targetMessageId]) {
            acc[targetMessageId] = [];
          }
          acc[targetMessageId].push({
            message,
            timestamp: Number(message.messageTimestamp),
          });
        }
        return acc;
      },
      {} as Record<string, Array<{ message: Message; timestamp: number }>>,
    );

    Object.entries(reactionsByMessageId).forEach(
      ([targetMessageId, reactions]) => {
        const targetMessageIndex = processedMessages.findIndex(
          (msg) => msg.key.id === targetMessageId,
        );

        if (targetMessageIndex !== -1) {
          const lastReaction = reactions.sort(
            (a, b) => b.timestamp - a.timestamp,
          )[0];

          if (lastReaction.message.message?.reactionMessage.text) {
            processedMessages[targetMessageIndex] = {
              ...processedMessages[targetMessageIndex],
              reactions: [
                {
                  emoji: lastReaction.message.message.reactionMessage.text,
                  sender: lastReaction.message.pushName,
                  messageId: lastReaction.message.key.id,
                  timestamp: lastReaction.timestamp,
                },
              ],
            };
          } else {
            processedMessages[targetMessageIndex] = {
              ...processedMessages[targetMessageIndex],
              reactions: [],
            };
          }
        }
      },
    );

    return processedMessages.filter(
      (message) => !message.message?.reactionMessage,
    );
  };

  const processMessagesWithReactions = (messages: Message[]) => {
    return instance?.integration === "WHATSAPP-EVOLUTION" ||
      instance?.integration === "WHATSAPP-WHATSMEOW"
      ? processWhatsmeowMessagesWithReactions(messages)
      : processOfficialMessagesWithReactions(messages);
  };

  const checkIfItHasQuotedMessage = (message: Message) => {
    const contextInfo = message.contextInfo || message.message?.contextInfo;

    const { stanzaId } = contextInfo || {};

    if (!stanzaId) return;

    const quotedMessage = messages.find(
      (msg) =>
        msg.key.id === stanzaId && !msg.message.senderKeyDistributionMessage,
    );

    return quotedMessage;
  };

  // Função para rolar até a mensagem citada
  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Opcional: adicionar um highlight temporário
      messageElement.classList.add("highlight-quoted");
      setTimeout(() => {
        messageElement.classList.remove("highlight-quoted");
      }, 2000);
    }
  };

  return (
    <div
      className="custom-scrollbar flex-grow overflow-y-auto"
      style={containerStyle}
    >
      <div className="relative mx-auto box-border flex w-full max-w-[64rem] flex-col gap-6 bg-transparent p-[0.375rem_1rem_0_1rem]">
        {!instance?.instanceName ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex h-full items-center justify-center"
            style={{
              color: textForegroundColor,
            }}
          >
            {t("chat.noMessage")}
          </div>
        ) : (
          processMessagesWithReactions(messages)
            .filter((message) => !message.message.senderKeyDistributionMessage)
            .sort(
              (a, b) =>
                new Date(a.messageTimestamp).getTime() -
                new Date(b.messageTimestamp).getTime(),
            )
            .map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <MessageBubble
                  key={message.key.id}
                  id={`message-${message.key.id}`}
                  fromMe={message.key.fromMe}
                  isLastMessage={isLastMessage}
                  reference={lastMessageRef}
                >
                  {!checkIfIsDeleted(message) ? (
                    <>
                      <MessageOptions
                        message={message}
                        fromMe={message.key.fromMe}
                      />
                      <MessageContent
                        message={message}
                        quotedMessage={checkIfItHasQuotedMessage(message)}
                        chat={chat}
                        fromMe={message.key.fromMe}
                        onQuoteClick={scrollToMessage}
                      />
                    </>
                  ) : (
                    <MessageBubble.Content fromMe={message.key.fromMe}>
                      <div className="text-muted-foreground">
                        {t("chat.message.deleted")}
                      </div>
                    </MessageBubble.Content>
                  )}
                </MessageBubble>
              );
            })
        )}
      </div>
    </div>
  );
};

export { Messages };
