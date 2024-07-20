import "./instance-layout.css";

import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface LayoutProps {
  children: React.ReactNode;
}

function InstanceLayout({ children }: LayoutProps) {
  const { instanceId } = useParams<{ instanceId: string }>();

  return (
    <>
      <Header perfil={true} />
      <div className="layout-general">
        <div className="instance-layout">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={15}>
              <Sidebar instanceId={`${instanceId}`} />
            </ResizablePanel>
            <ResizableHandle withHandle className="border border-black" />
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}

export { InstanceLayout };
