import { ReactNode } from "react";

export function PrivateLayout({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
