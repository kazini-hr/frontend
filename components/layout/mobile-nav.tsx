"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { navigation } from "@/lib/routes";
import Link from "next/link";
import { NavItem } from "./nav-item";

const MobileNav = ({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/images/kazini-logo-only.png"
                alt="logo"
                width={32}
                height={32}
              />
              <h2 className="text-lg font-semibold">KaziniHR</h2>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <div className="text-md font-bold text-gray-900">Payroll</div>
          {navigation.payroll.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}

          <div className="text-md font-bold text-gray-900">Company</div>
          {navigation.company.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
