<<<<<<< HEAD
import "./instance-layout.css";

import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useParams } from "react-router-dom";
=======
// InstanceLayout.tsx
import "./instance-layout.css";
import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
<<<<<<< HEAD
=======
import { InstanceProvider } from "@/contexts/InstanceContext";
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392

interface LayoutProps {
  children: React.ReactNode;
}

function InstanceLayout({ children }: LayoutProps) {
<<<<<<< HEAD
  const { instanceId } = useParams<{ instanceId: string }>();

  return (
    <>
=======
  return (
    <InstanceProvider>
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
      <Header perfil={true} />
      <div className="layout-general">
        <div className="instance-layout">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={15}>
<<<<<<< HEAD
              <Sidebar instanceId={`${instanceId}`} />
=======
              <Sidebar />
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
            </ResizablePanel>
            <ResizableHandle withHandle className="border border-black" />
            <ResizablePanel>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
<<<<<<< HEAD
    </>
=======
    </InstanceProvider>
>>>>>>> 4cc9370dbfe3c7a3d271f87e6e12747f59f42392
  );
}

export { InstanceLayout };
