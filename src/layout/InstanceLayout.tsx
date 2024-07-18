import "./instance-layout.css";

import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useParams } from "react-router-dom";

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
          <Sidebar instanceId={`${instanceId}`} />
          <main className="main-content">{children}</main>
        </div>
      </div>
    </>
  );
}

export { InstanceLayout };
