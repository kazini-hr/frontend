import { ReactNode } from "react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function PageViewLayout({
  title,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="container mx-auto py-4 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
