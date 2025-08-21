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
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
