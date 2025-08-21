"use client";

// import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, Badge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/lib/routes";

const DesktopSidebar = ({ pathname = "dashboard" }: { pathname: string }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };
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

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navigation.map((group) => (
            <div key={group.title}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                {group.title}
                {openGroups[group.title] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Group items */}
              {openGroups[group.title] && (
                <div className="ml-4 mt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-semibold">
                          {item.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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

// <nav className="flex-1 px-4 mt-6 space-y-2">
// {navigation.map((group) => (
//   <div key={group.title}>
//     {/* Group header */}
//     <button
//       onClick={() => toggleGroup(group.title)}
//       className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
//     >
//       {group.title}
//       {openGroups[group.title] ? (
//         <ChevronDown className="h-4 w-4" />
//       ) : (
//         <ChevronRight className="h-4 w-4" />
//       )}
//     </button>

//     {/* Group items */}
//     {openGroups[group.title] && (
//       <div className="ml-4 mt-1 space-y-1">
//         {group.items.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={cn(
//               "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
//               pathname === item.href
//                 ? "bg-blue-50 text-blue-700 border border-blue-200"
//                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//             )}
//           >
//             <div className="flex-1 truncate">{item.title}</div>
//             {item.badge && (
//               <Badge variant="secondary" className="text-xs">
//                 {item.badge}
//               </Badge>
//             )}
//           </Link>
//         ))}
//       </div>
//     )}
//   </div>
// ))}
// </nav>
