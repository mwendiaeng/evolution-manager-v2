import { isAxiosError } from "axios";
import { ArrowUpIcon, MicIcon, SquareIcon, TrashIcon } from "lucide-react";
import React, { useRef, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";

import { useEmbedColors } from "@/contexts/EmbedColorsContext";
import { useEmbedInstance } from "@/contexts/EmbedInstanceContext";
import { ReplyMessageContext } from "@/contexts/ReplyingMessage/ReplyingMessageContext";

import {
  useSendMessage,
  useSendMedia,
  useSendAudio,
} from "@/lib/queries/messages/sendMessage";

import { Contact, Instance } from "@/types/evolution.types";

import { MediaOptions } from "./media-options";
import { ReplyingMessage } from "./replying-message";
import { SelectedMedia } from "./selected-media";
import WhatsAppEmojiBox from "./whatsapp-emoji-box";

interface AudioControlsProps {
  isSendingMessage: boolean;
  isRecording: boolean;
  audioBlob: Blob | null;
  elapsedTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;
  sendAudioMessage: () => void;
  disabled?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isSendingMessage,
  isRecording,
  audioBlob,
  elapsedTime,
  startRecording,
  stopRecording,
  clearRecording,
  sendAudioMessage,
  disabled,
}) => {
  const { inputIconsMainColor } = useEmbedColors();

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full p-2"
            onClick={stopRecording}
          >
            <SquareIcon className="h-6 w-6 text-[#b03f3f]" />
          </Button>
          <span>{elapsedTime}s</span>
        </div>
      )}

      {audioBlob && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full p-2"
            disabled={isSendingMessage}
            onClick={clearRecording}
          >
            <TrashIcon className="h-6 w-6 text-[#b03f3f]" />
          </Button>
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}

      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full p-2"
        disabled={isSendingMessage || isRecording || disabled}
        onClick={audioBlob ? sendAudioMessage : startRecording}
      >
        {isSendingMessage ? (
          <LoadingSpinner
            className="h-6 w-6"
            style={{ color: inputIconsMainColor }}
          />
        ) : audioBlob ? (
          <ArrowUpIcon
            className="h-6 w-6"
            style={{ color: inputIconsMainColor }}
          />
        ) : (
          <MicIcon className="h-6 w-6" style={{ color: inputIconsMainColor }} />
        )}
      </Button>
    </div>
  );
};

interface SendMessageButtonProps {
  isSendingMessage: boolean;
  sendMessage: () => void;
  disabled?: boolean;
}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({
  isSendingMessage,
  sendMessage,
  disabled,
}) => {
  const { inputIconsMainColor } = useEmbedColors();
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="rounded-full p-2"
      onClick={sendMessage}
      disabled={isSendingMessage || disabled}
    >
      {isSendingMessage ? (
        <LoadingSpinner
          className="h-6 w-6"
          style={{ color: inputIconsMainColor }}
        />
      ) : (
        <ArrowUpIcon
          className="h-6 w-6"
          style={{ color: inputIconsMainColor }}
        />
      )}
    </Button>
  );
};

interface InputMessageProps {
  chat: Contact;
}

const InputMessage = ({ chat }: InputMessageProps) => {
  const [searchParams] = useSearchParams();
  const { inputBackgroundColor, inputTextForegroundColor } = useEmbedColors();
  const remoteJid = searchParams.get("remoteJid");
  const { instance: embeddedInstance } = useEmbedInstance();
  const { sendText } = useSendMessage(); // Hook para enviar mensagens
  const { sendMedia } = useSendMedia(); // Hook para enviar mídias
  const { sendAudio } = useSendAudio(); // Hook para enviar áudios

  const { replyingMessage, setReplyingMessage } =
    useContext(ReplyMessageContext); // Contexto da mensagem respondida

  // Referência para o textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // Referência para o timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Referência para o mediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Estado que mantém a mensagem do textarea
  const [message, setMessage] = useState("");

  // Estado de carregamento da mensagem
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Estado que mantém a midia selecionada
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);

  // Estado de envio de audio
  const [isRecording, setIsRecording] = useState(false);

  // Estado que mantém o audio gravado
  const [audioBlob, setAudioBlob] = useState<File | null>(null);

  // Estado que mantém o tempo decorrido da gravação
  const [elapsedTime, setElapsedTime] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    setReplyingMessage(null);
    setSelectedMedia(null);
  }, [remoteJid, setReplyingMessage, setSelectedMedia]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
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

  const handleEmojiClick = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
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

  // const convertToBase64 = (file: File) => {
  //   return new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       resolve(reader.result as string);
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100, // Padrão para AAC
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Verifica formatos aceitos pela Meta
      let mimeType = "";
      const metaFormats = [
        "audio/aac",
        "audio/mp4",
        "audio/mpeg",
        "audio/amr",
        "audio/ogg",
        "audio/opus",
      ];

      for (const format of metaFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format;
          break;
        }
      }

      if (!mimeType) {
        throw new Error("Nenhum formato aceito pela Meta disponível");
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioFile = new File(
          [audioBlob],
          `audio.${mimeType.split("/")[1]}`,
          {
            type: mimeType,
            lastModified: Date.now(),
          },
        );
        setAudioBlob(audioFile);
      };

      mediaRecorder.start();

      timerRef.current = setInterval(() => {
        setElapsedTime((time) => time + 1);
      }, 1000);
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      toast.error(t("chat.toast.recordingError"));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setElapsedTime(0);
  };

  const handleError = (error: unknown) => {
    console.error("Error to send message", error);
    toast.error(
      isAxiosError(error)
        ? `${t("chat.toast.error")}: ${error?.response?.data?.response?.message}`
        : t("chat.toast.sendError"),
    );
  };

  const handleSettled = () => {
    setIsSendingMessage(false);
    setReplyingMessage(null);
  };

  // Função para enviar mensagem
  const sendTextMessage = async () => {
    if (!embeddedInstance || !remoteJid) return;

    const info = {
      instanceName: embeddedInstance.instanceName,
      token: embeddedInstance.token,
      data: {
        number: remoteJid,
        textMessage: {
          text: message,
        },
        options: {
          quoted: replyingMessage,
        },
      },
    };

    // Envia a mensagem
    await sendText(info, {
      onSuccess: () => {
        setMessage(""); // Limpa o textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      },
      onError: handleError,
      onSettled: handleSettled,
    });
  };

  const sendMediaMessage = async () => {
    if (!embeddedInstance || !selectedMedia || !remoteJid) return;

    const info = {
      instanceName: embeddedInstance.instanceName,
      token: embeddedInstance.token,
      data: {
        number: remoteJid,
        mediaMessage: {
          mediatype:
            selectedMedia.type.split("/")[0] === "application"
              ? "document"
              : selectedMedia.type.split("/")[0],
          mimetype: selectedMedia.type,
          caption: message,
          media: selectedMedia,
          fileName: selectedMedia.name,
        },
        options: {
          quoted: replyingMessage,
        },
      },
    };

    await sendMedia(info, {
      onSuccess: () => {
        setSelectedMedia(null); // Limpa a mídia selecionada
        setMessage(""); // Limpa o textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      },
      onError: handleError,
      onSettled: handleSettled,
    });
  };

  const sendAudioMessage = async () => {
    if (!embeddedInstance || !audioBlob || !remoteJid) return;

    setIsSendingMessage(true);

    const info = {
      instanceName: embeddedInstance.instanceName,
      token: embeddedInstance.token,
      data: {
        number: remoteJid,
        audioMessage: {
          audio: audioBlob,
        },
        options: {
          quoted: replyingMessage,
        },
      },
    };

    await sendAudio(info, {
      onSuccess: () => {
        setAudioBlob(null); // Limpa o áudio gravado
        setElapsedTime(0); // Zera o tempo decorrido
      },
      onError: handleError,
      onSettled: handleSettled,
    });
  };

  // Função que decide qual tipo de mensagem enviar
  const sendMessage = async () => {
    setIsSendingMessage(true); // Ativa o estado de carregamento
    selectedMedia ? await sendMediaMessage() : await sendTextMessage();
  };

  // Renderiza os controles de mensagem
  const renderMessageControls = () => {
    if (!message && !selectedMedia) {
      return (
        <AudioControls
          isSendingMessage={isSendingMessage}
          isRecording={isRecording}
          audioBlob={audioBlob}
          elapsedTime={elapsedTime}
          startRecording={startRecording}
          stopRecording={stopRecording}
          clearRecording={clearRecording}
          sendAudioMessage={sendAudioMessage}
        />
      );
    }

    return (
      <SendMessageButton
        isSendingMessage={isSendingMessage}
        sendMessage={sendMessage}
      />
    );
  };

  const renderInputArea = () => {
    if (isRecording || audioBlob) {
      return renderMessageControls();
    }

    return (
      <>
        <WhatsAppEmojiBox handleEmojiClick={handleEmojiClick} />
        <MediaOptions
          instance={embeddedInstance as Instance}
          setSelectedMedia={setSelectedMedia}
        />
        <Textarea
          placeholder={t("chat.message.placeholder")}
          name="message"
          id="message"
          rows={1}
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter" && !isSendingMessage) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="min-h-0 w-full resize-none rounded-lg border-none p-3 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
          style={{
            backgroundColor: inputBackgroundColor,
            color: inputTextForegroundColor,
          }}
        />
        {renderMessageControls()}
      </>
    );
  };

  if (!embeddedInstance) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          {t("chat.noInstance") || "Nenhuma instância selecionada"}
        </p>
      </div>
    );
  }

  return (
    <div className="input-container">
      {selectedMedia && (
        <SelectedMedia
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
        />
      )}
      {replyingMessage && <ReplyingMessage chat={chat} />}
      <div
        className={`flex items-end ${
          (isRecording || audioBlob) && "justify-end"
        } rounded-3xl px-4 py-1`}
        style={{
          backgroundColor: inputBackgroundColor,
          color: inputTextForegroundColor,
        }}
      >
        {renderInputArea()}
      </div>
    </div>
  );
};

export { InputMessage };
