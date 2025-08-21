"use client";

import PageViewLayout from "./page-view-layout";
import DesktopSidebar from "./desktop-sidebar";
import MobileNav from "./mobile-nav";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { navigation } from "@/lib/routes";
import { ChevronRight } from "lucide-react";
import React from "react";
import ProfileDropdown from "./profile-dropdown";
import { Toaster } from "sonner";

interface FullLayoutProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

function Breadcrumb() {
  const pathname = usePathname();

  const navMap = navigation.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupTitle: group.title,
    }))
  );

  const current = navMap.find((item) => pathname.startsWith(item.href));

  if (!current) return null;

  const crumbs = [
    {
      title: current.groupTitle,
      href:
        navigation.find((g) => g.title === current.groupTitle)?.items[0].href ||
        "#",
    },
    { title: current.title, href: current.href },
  ];

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <div key={crumb.title} className="flex items-center">
          {i > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.title}</span>
          ) : (
            <Link href={crumb.href} className="hover:underline">
              {crumb.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function FullLayout({
  children,
  title,
  description,
}: FullLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors />
      <DesktopSidebar pathname={"dashboard"} />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        pathname={pathname}
      />

      <div className={"lg:pl-64"}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>

            <Link href="/">
              <Image
                src="/images/kazini-hr-original-colors-transparent.png"
                alt="Kazini HR"
                width={100}
                height={100}
              />
            </Link>
            <ProfileDropdown />
          </div>
        </header>

        {/* Desktop Header with Breadcrumb */}
        <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Breadcrumb />
            </div>
            <ProfileDropdown />
          </div>
        </header>

        <PageViewLayout title={title} description={description}>
          {children}
        </PageViewLayout>
      </div>
    </div>
  );
}
