import { NavItem as NavItemType } from "@/lib/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function NavItem({
  item,
  pathname,
}: {
  item: NavItemType;
  pathname: string;
}) {
  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200",
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
  );
}
