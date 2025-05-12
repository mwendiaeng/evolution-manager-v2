import { Check, CheckCheck } from "lucide-react";
import moment from "moment";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Message, Chat } from "@/types/evolution.types";

import { getContactColor } from "@/utils/contact-colors";

import { MessageBubble } from "./message-bubble";
import { MessageRenderer } from "./message-renderer";
import { QuotedMessage } from "./quoted-message";

// Adicione ao tipo Message (você pode fazer isso no arquivo de tipos)
interface Reaction {
  emoji: string;
  sender: string;
  messageId: string;
}

interface MessageContentProps {
  message: Message & { reactions?: Reaction[] };
  quotedMessage?: Message;
  chat?: Chat;
  fromMe: boolean;
}

export function MessageContent({
  message,
  quotedMessage,
  chat,
  fromMe,
  onQuoteClick,
}: MessageContentProps & { onQuoteClick?: (messageId: string) => void }) {
  // Verifica se a mensagem foi lida
  const checkDeliveryStatus = () => {
    const { messageUpdate } = message;

    if (!messageUpdate || !Array.isArray(messageUpdate)) {
      return <Check className="h-4 w-4" />;
    }

    const statuses = messageUpdate.map((update) => update.status);
    return statuses.includes("READ") ? (
      <CheckCheck className="h-4 w-4 text-teal-500" />
    ) : (
      <CheckCheck className="h-4 w-4" />
    );
  };

  // Renderiza o nome do participante
  const renderParticipantName = () => {
    // Se o participante não existe ou a mensagem é minha, não renderiza o nome
    if (!message.key.participant || fromMe) return null;

    return (
      <span
        className={`text-xs font-bold ${getContactColor(
          message.key.participant,
        )}`}
      >
        {message.key.participantPushName || message.key.participant}
      </span>
    );
  };

  /** TODO: Alterar o Z-INDEX do tooltip */
  const renderReactions = () => {
    // Se não houver reações, retorna null
    if (!message.reactions?.length) return null;

    // Agrupa as reações por emoji
    const groupedReactions = message.reactions.reduce(
      (acc, reaction) => {
        // Inicializa o acumulador para este emoji se não existir
        acc[reaction.emoji] = acc[reaction.emoji] || {
          emoji: reaction.emoji,
          senders: [],
        };

        // Tenta extrair o nome do remetente
        const senderName = reaction.sender.includes("@g.us")
          ? message.key.participantPushName || reaction.sender.split("@")[0]
          : reaction.sender.split("@")[0];

        // Adiciona o remetente à lista de senders deste emoji
        acc[reaction.emoji].senders.push(senderName);
        return acc;
      },
      {} as Record<string, { emoji: string; senders: string[] }>,
    );

    // Limita a exibição a 3 reações
    const limitedReactions = Object.values(groupedReactions).slice(0, 3);

    return (
      // Interface do tooltip
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Container das reações */}
            <div
              className={`absolute -bottom-4 cursor-pointer ${
                fromMe ? "right-0" : "left-0"
              } flex rounded-full bg-gray-100 px-1 dark:bg-gray-900`}
            >
              {/* Renderiza cada emoji */}
              {limitedReactions.map((reaction) => (
                <div key={reaction.emoji} className="flex items-center">
                  {reaction.emoji}
                </div>
              ))}
              {/* Mostra o contador se houver mais de uma reação */}
              {message.reactions.length > 1 && (
                <span className="ml-1 flex items-center pr-2 text-xs text-muted-foreground">
                  {message.reactions.length}
                </span>
              )}
            </div>
          </TooltipTrigger>
          {/* Conteúdo do tooltip */}
          <TooltipContent>
            {limitedReactions.map((reaction) => (
              <div key={reaction.emoji} className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span>{reaction.emoji}</span>
                  <span className="text-sm">{reaction.senders.join(", ")}</span>
                </div>
              </div>
            ))}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <MessageBubble.Content fromMe={fromMe}>
      {renderReactions()}
      {quotedMessage && (
        <QuotedMessage
          message={message}
          quotedMessage={quotedMessage}
          chat={chat}
          onQuoteClick={() => onQuoteClick?.(quotedMessage.key.id)}
        />
      )}

      {renderParticipantName()}

      <div className="flex flex-col">
        <MessageRenderer message={message} fromMe={fromMe} />

        <MessageBubble.Footer fromMe={fromMe}>
          {moment
            .unix(Number(message.messageTimestamp))
            .local()
            .format("HH:mm")}
          {fromMe && checkDeliveryStatus()}
        </MessageBubble.Footer>
      </div>
    </MessageBubble.Content>
  );
}
