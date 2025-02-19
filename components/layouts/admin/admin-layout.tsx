import { ReactNode } from "react";

export function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
