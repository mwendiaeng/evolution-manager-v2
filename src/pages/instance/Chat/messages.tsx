import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
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

type MessagesProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleTextareaChange: () => void;
  textareaHeight: string;
  lastMessageRef: React.RefObject<HTMLDivElement>;
};

function Messages({
  textareaRef,
  handleTextareaChange,
  textareaHeight,
  lastMessageRef,
}: MessagesProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-muted text-lg"
            >
              Davidson Gomes
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-w-[300px]">
            <DropdownMenuItem className="items-start gap-2">
              <SparkleIcon className="w-4 h-4 mr-2 translate-y-1 shrink-0" />
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
              <ZapIcon className="w-4 h-4 mr-2 translate-y-1 shrink-0" />
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
      <div className="flex flex-col flex-1 max-w-4xl gap-8 px-4 mx-auto message-container overflow-y-auto">
        <div className="bubble-right">
          <div className="flex items-start gap-4 self-end">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Can you explain airplane turbulence to someone who has never
                    flown before? Make it conversational and concise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bubble-left">
          <div className="flex items-start gap-4">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Of course! Imagine you&apos;re in a car driving down a bumpy
                    road, and the ride isn&apos;t perfectly smooth. Sometimes,
                    you hit small potholes or bumps, right? Well, when
                    you&apos;re in an airplane, it&apos;s kind of like that, but
                    in the sky.
                  </p>
                  <p>
                    Airplane turbulence happens when the plane encounters
                    pockets of air that are moving differently. It&apos;s like
                    sailing a boat on choppy water. These air pockets can make
                    the plane feel like it&apos;s bouncing or shaking a bit.
                    It&apos;s completely normal and usually not dangerous at
                    all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bubble-right">
          <div className="flex items-start gap-4 self-end">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Can you explain airplane turbulence to someone who has never
                    flown before? Make it conversational and concise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bubble-left">
          <div className="flex items-start gap-4">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Of course! Imagine you&apos;re in a car driving down a bumpy
                    road, and the ride isn&apos;t perfectly smooth. Sometimes,
                    you hit small potholes or bumps, right? Well, when
                    you&apos;re in an airplane, it&apos;s kind of like that, but
                    in the sky.
                  </p>
                  <p>
                    Airplane turbulence happens when the plane encounters
                    pockets of air that are moving differently. It&apos;s like
                    sailing a boat on choppy water. These air pockets can make
                    the plane feel like it&apos;s bouncing or shaking a bit.
                    It&apos;s completely normal and usually not dangerous at
                    all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bubble-right">
          <div className="flex items-start gap-4 self-end">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Can you explain airplane turbulence to someone who has never
                    flown before? Make it conversational and concise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bubble-left">
          <div className="flex items-start gap-4">
            <div className="grid gap-1">
              <div className="prose text-muted-foreground">
                <div className="bubble">
                  <p>
                    Of course! Imagine you&apos;re in a car driving down a bumpy
                    road, and the ride isn&apos;t perfectly smooth. Sometimes,
                    you hit small potholes or bumps, right? Well, when
                    you&apos;re in an airplane, it&apos;s kind of like that, but
                    in the sky.
                  </p>
                  <p>
                    Airplane turbulence happens when the plane encounters
                    pockets of air that are moving differently. It&apos;s like
                    sailing a boat on choppy water. These air pockets can make
                    the plane feel like it&apos;s bouncing or shaking a bit.
                    It&apos;s completely normal and usually not dangerous at
                    all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={lastMessageRef as never} />
      </div>
      <div className="max-w-2xl w-full sticky bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4 bg-background">
        <div className="relative input-message">
          <Button
            type="button"
            size="icon"
            className="absolute w-8 h-8 bottom-3 left-3 rounded-full bg-transparent text-white hover:bg-transparent"
          >
            <Paperclip className="w-4 h-4 text-white" />
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
            className="min-h-[48px] max-h-[240px] rounded-3xl resize-none p-4 pl-12 pr-16 border border-none shadow-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 bottom-3 right-3 rounded-full"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Messages };
