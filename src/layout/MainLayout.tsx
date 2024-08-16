import React from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

interface LayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <div className="layout-general">
        <main className="content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export { MainLayout };
