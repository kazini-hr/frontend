"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const DesktopSidebar = ({ pathname = "dashboard" }: { pathname: string }) => {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 px-6 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image
              src="/images/kazini-logo-only.png"
              alt="logo"
              width={32}
              height={32}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">KaziniHR</h1>
          </div>
        </div>

        {/* Navigation
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0",
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate">{item.title}</div>
                {item.description && (
                  <div
                    className={cn(
                      "text-xs truncate",
                      pathname === item.href ? "text-blue-500" : "text-gray-500"
                    )}
                  >
                    {item.description}
                  </div>
                )}
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav> */}

        {/* Footer */}
        <div className="px-4 pt-4 border-t border-gray-200">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Need Help?</div>
              <p>Contact support for assistance with your payroll system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
