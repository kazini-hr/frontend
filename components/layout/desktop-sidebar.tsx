"use client";

import Image from "next/image";
import { navigation } from "@/lib/routes";
import { NavItem } from "./nav-item";

const DesktopSidebar = ({ pathname = "dashboard" }: { pathname: string }) => {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
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

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <div className="text-md font-bold text-gray-900">Payroll</div>
          {navigation.payroll.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}

          <div className="text-md font-bold text-gray-900 pt-4">Company</div>
          {navigation.company.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

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
