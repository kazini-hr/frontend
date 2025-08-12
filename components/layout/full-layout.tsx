"use client";

import PageViewLayout from "./page-view-layout";
import DesktopSidebar from "./desktop-sidebar";
import MobileNav from "./mobile-nav";

interface FullLayoutProps {
  title: string;
  description?: string;
  sidebar?: boolean;
  children: React.ReactNode;
}

export default function FullLayout({
  children,
  title,
  description,
  sidebar = true,
}: FullLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {sidebar && <DesktopSidebar pathname={"dashboard"} />}
      <MobileNav isOpen={true} onClose={() => {}} pathname={"dashboard"} />
      <div className={sidebar ? "lg:pl-64" : ""}>
        <PageViewLayout
          title={title}
          description={description}
          sidebar={sidebar}
        >
          {children}
        </PageViewLayout>
      </div>
    </div>
  );
}
