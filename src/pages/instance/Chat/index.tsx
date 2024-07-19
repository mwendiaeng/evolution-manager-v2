import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";
import { MessageCircle, PlusIcon } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function Chat() {
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
          <div className="flex-1 overflow-auto">
            <div className="grid gap-1 p-2 text-foreground">
              <div className="px-2 text-xs font-medium text-muted-foreground">
                Contatos
              </div>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Davidson Gomes - 557499879409
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Davidson Gomes - 557499879409
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Davidson Gomes - 557499879409
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Davidson Gomes - 557499879409
              </Link>
            </div>
            <div className="grid gap-1 p-2 text-foreground">
              <div className="px-2 text-xs font-medium text-muted-foreground">
                Grupos
              </div>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Evolution API - 123456789@g.us
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Evolution API - 123456789@g.us
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Evolution API - 123456789@g.us
              </Link>
              <Link
                to="#"
                className="flex-1 block p-2 overflow-hidden text-sm truncate transition-colors rounded-md whitespace-nowrap hover:bg-muted/50"
              >
                Evolution API - 123456789@g.us
              </Link>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="border border-black" />
      <ResizablePanel>
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
                      With DALL-E, browing and analysis. Limit 40 messages / 3
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
          <div className="flex flex-col items-start flex-1 max-w-2xl gap-8 px-4 mx-auto">
            <div className="flex items-start gap-4">
              <Avatar className="w-6 h-6 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold">Você</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Can you explain airplane turbulence to someone who has never
                    flown before? Make it conversational and concise.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="w-6 h-6 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold">Davidson Gomes</div>
                <div className="prose text-muted-foreground">
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
                <div className="flex items-center gap-2 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                  >
                    <ClipboardIcon className="w-4 h-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                  >
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span className="sr-only">Upvote</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                  >
                    <ThumbsDownIcon className="w-4 h-4" />
                    <span className="sr-only">Downvote</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                  >
                    <RefreshCcwIcon className="w-4 h-4" />
                    <span className="sr-only">Regenerate</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-2xl w-full sticky bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4 bg-background">
            <div className="relative">
              <Textarea
                placeholder="Enviar mensagem..."
                name="message"
                id="message"
                rows={1}
                className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute w-8 h-8 top-3 right-3"
                disabled
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function ArrowUpIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ChevronDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ClipboardIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function RefreshCcwIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function SparkleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function ThumbsDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

// function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }

function ZapIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

export { Chat };
