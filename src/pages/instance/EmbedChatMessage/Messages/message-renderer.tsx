import { FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Message } from "@/types/evolution.types";

import { AudioPlayer } from "./audio-player";
import { ContactMessage } from "./contact-message";
import { ConversationMessage } from "./conversation-message";
import { LocationMessage } from "./location-message";
import { MarkdownWrapper } from "./markdown-wrapper";

interface MessageRendererProps {
  message: Message;
  fromMe: boolean;
}

export function MessageRenderer({ message, fromMe }: MessageRendererProps) {
  switch (message.messageType as string) {
    case "conversation": {
      if (message.message.contactMessage) {
        return (
          <ContactMessage
            contactMessage={message.message.contactMessage}
            fromMe={fromMe}
          />
        );
      }

      if (message.message.locationMessage) {
        return (
          <LocationMessage
            locationMessage={message.message.locationMessage}
            fromMe={fromMe}
          />
        );
      }

      return <ConversationMessage message={message} />;
    }
    case "extendedTextMessage":
      return (
        <MarkdownWrapper>
          {message.message.conversation ??
            message.message.extendedTextMessage?.text}
        </MarkdownWrapper>
      );

    case "imageMessage":
      return (
        <div className="mb-2 flex flex-col gap-2">
          <img
            src={message.message.mediaUrl}
            width="400px"
            alt="Image"
            style={{
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
          <MarkdownWrapper>
            {message.message.imageMessage?.caption}
          </MarkdownWrapper>
        </div>
      );

    case "videoMessage":
      return (
        <div className="mb-2 flex flex-col gap-2">
          <video src={message.message.mediaUrl} width="400px" controls />
          <MarkdownWrapper>
            {message.message.videoMessage?.caption}
          </MarkdownWrapper>
        </div>
      );

    case "audioMessage":
      return (
        <AudioPlayer
          audioUrl={message.message.mediaUrl}
          fromMe={fromMe}
          profilePicUrl={message.key.profilePicUrl}
        />
      );

    case "documentMessage":
      return (
        <Button
          className={`-m-2 mb-2 gap-1 rounded-lg ${
            fromMe
              ? "bg-[#b2ece0] text-black hover:bg-[#a4ecde] dark:bg-[#082720] dark:text-white dark:hover:bg-[#071f19]"
              : "bg-[#d2e2e2] text-black hover:bg-[#c2d2d2] dark:bg-[#0f1413] dark:text-white dark:hover:bg-[#141a18]"
          }`}
        >
          <FileIcon className="h-4 w-4" />
          {message.message.documentMessage.fileName}
        </Button>
      );

    case "documentWithCaptionMessage":
      return (
        <>
          <Button
            className={`-m-2 mb-2 gap-1 rounded-lg ${
              fromMe
                ? "bg-[#b2ece0] text-black hover:bg-[#a4ecde] dark:bg-[#082720] dark:text-white dark:hover:bg-[#071f19]"
                : "bg-[#d2e2e2] text-black hover:bg-[#c2d2d2] dark:bg-[#0f1413] dark:text-white dark:hover:bg-[#141a18]"
            }`}
          >
            <FileIcon className="h-4 w-4" />
            {
              message.message.documentWithCaptionMessage.message.documentMessage
                .fileName
            }
          </Button>
          <MarkdownWrapper>
            {
              message.message.documentWithCaptionMessage.message.documentMessage
                .caption
            }
          </MarkdownWrapper>
        </>
      );

    case "stickerMessage":
      return (
        <img
          src={message.message.mediaUrl}
          alt="Sticker"
          width="100px"
          style={{
            maxHeight: "100px",
            objectFit: "contain",
          }}
        />
      );

    case "contactMessage":
      return (
        <ContactMessage
          contactMessage={message.message.contactMessage}
          fromMe={fromMe}
        />
      );

    case "locationMessage":
      return (
        <LocationMessage
          locationMessage={message.message.locationMessage}
          fromMe={fromMe}
        />
      );

    default:
      return <>{JSON.stringify(message.message)}</>;
  }
}
