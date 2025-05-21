import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
// Importações de contextos
import { ChevronDown } from "lucide-react";
import moment from "moment";

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
  const { backgroundColor, textForegroundColor, primaryColor } = useEmbedColors();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const { t } = useTranslation();

  const containerStyle = {
    backgroundColor,
    color: textForegroundColor,
  };

  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Add some threshold to avoid issues with pixel-perfect detection
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
    return isBottom;
  };

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

  // Load initial messages and scroll to bottom
  useEffect(() => {
    if (isSuccess && initialMessages) {
      setMessages(initialMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isSuccess, initialMessages, setMessages]);
  
  // Reset component state when opening a new chat
  useEffect(() => {
    // Reset all state values when changing chats
    setIsAtBottom(true);
    setShowScrollButton(false);
    setNewMessagesCount(0);
    prevMessagesLengthRef.current = 0;
    
    // Scroll to bottom with a delay to ensure rendering is complete
    if (messages.length > 0) {
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
  }, [remoteJid]);

  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = checkIfAtBottom();
      setIsAtBottom(atBottom);
      
      if (atBottom) {
        // User scrolled to bottom, hide button and reset counter
        setShowScrollButton(false);
        setNewMessagesCount(0);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll-to-bottom function
  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      // Use smooth scrolling animation when scrolling to the last message
      lastMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
      
      // After scrolling to bottom, update state
      setIsAtBottom(true);
      setShowScrollButton(false);
      setNewMessagesCount(0);
    } else {
      // Fallback if reference to last message isn't available
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
        
        // After scrolling to bottom, update state
        setIsAtBottom(true);
        setShowScrollButton(false);
        setNewMessagesCount(0);
      }
    }
  };

  // Handle messages changes
  useEffect(() => {
    if (messages.length > 0) {
      const hasNewMessages = messages.length > prevMessagesLengthRef.current;
      prevMessagesLengthRef.current = messages.length;
      
      if (hasNewMessages) {
        if (isAtBottom) {
          // User is at bottom, auto-scroll to newest message
          scrollToBottom();
        } else {
          // User is scrolled up, show button with counter
          setShowScrollButton(true);
          setNewMessagesCount(prev => prev + 1);
        }
      }
    }
  }, [messages, isAtBottom]);

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
      ref={messagesContainerRef}
      className="custom-scrollbar flex-grow overflow-y-auto relative"
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
              (a, b) => {
                // Safely handle messages with missing timestamps
                const aTime = a.messageTimestamp ? new Date(a.messageTimestamp).getTime() : 0;
                const bTime = b.messageTimestamp ? new Date(b.messageTimestamp).getTime() : 0;
                return aTime - bTime;
              },
            )
            .map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              // Generate a reliable ID for the message (either from key.id or fallback to index)
              const messageId = message.key?.id || `temp-${message.messageTimestamp}-${index}`;
              
              return (
                <MessageBubble
                  key={messageId}
                  id={`message-${messageId}`}
                  fromMe={message.key?.fromMe || false}
                  isLastMessage={isLastMessage}
                  reference={lastMessageRef}
                >
                  {!checkIfIsDeleted(message) ? (
                    <>
                      <MessageOptions
                        message={message}
                        fromMe={message.key?.fromMe || false}
                      />
                      <MessageContent
                        message={message}
                        quotedMessage={checkIfItHasQuotedMessage(message)}
                        chat={chat}
                        fromMe={message.key?.fromMe || false}
                        onQuoteClick={scrollToMessage}
                      />
                    </>
                  ) : (
                    <MessageBubble.Content fromMe={message.key?.fromMe || false}>
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
      
      {/* Fixed floating button - only shown when needed */}
      {showScrollButton && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: primaryColor || '#e2e8f0',
            color: textForegroundColor || '#000000',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease-in-out',
            border: `1px solid ${backgroundColor === '#ffffff' ? '#e2e8f0' : 'transparent'}`,
          }}
          onClick={scrollToBottom}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronDown size={24} />
          {newMessagesCount > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444', // Red color works well in both light/dark themes
                color: '#ffffff',
                minWidth: '24px',
                height: '24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                padding: '0 4px',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              {newMessagesCount > 99 ? '99+' : newMessagesCount}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { Messages };
