import React from "react";
import { useParams } from "react-router-dom";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { InstanceProvider } from "@/contexts/InstanceContext";

interface LayoutProps {
  children: React.ReactNode;
}

function InstanceLayout({ children }: LayoutProps) {
  const { instanceId } = useParams<{ instanceId: string }>();

  return (
    <InstanceProvider>
      <div className="flex h-screen flex-col">
        <Header instanceId={instanceId} />

        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col md:w-20 md:flex-row lg:w-64">
            <Sidebar />
            <Separator
              orientation="vertical"
              className="mx-auto h-[1px] w-[95%] md:my-auto md:h-[95%] md:w-[1px]"
            />
          </div>
          <ScrollArea className="w-full">
            <div className="flex min-h-[calc(100vh_-_81px)] flex-col gap-2 md:min-h-screen">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* <div className="layout-general">
        <div className="instance-layout">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={15}>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle className="border border-black" />
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div> */}
    </InstanceProvider>
  );
}

export { InstanceLayout };
