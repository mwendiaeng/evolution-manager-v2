import "./instance-layout.css";
import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { InstanceProvider } from "@/contexts/InstanceContext";
import { useParams } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

function InstanceLayout({ children }: LayoutProps) {

  const { instanceId } = useParams<{ instanceId: string }>();

  return (
    <InstanceProvider>
      <Header instanceId={instanceId} />
      <div className="layout-general">
        <div className="instance-layout">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={15}>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle className="border border-black" />
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </InstanceProvider>
  );
}

export { InstanceLayout };
