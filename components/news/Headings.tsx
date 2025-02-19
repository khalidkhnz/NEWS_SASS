import { cn } from "@/lib/utils";
import React from "react";

export default function Headings({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center text-nowrap justify-center font-serif font-bold text-md mt-2",
        className
      )}
    >
      <span className="w-[100%]  flex flex-col gap-[2px]">
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
      </span>
      <span className="text-[#2ea4d3]">[</span>
      <span className="">{children}</span>
      <span className="text-[#2ea4d3]">]</span>
      <span className="w-[100%]  flex flex-col gap-[2px]">
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
        <span className="h-[1px] w-full bg-neutral-300" />
      </span>
    </div>
  );
}
