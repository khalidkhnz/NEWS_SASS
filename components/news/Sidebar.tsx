"use client";

import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Menu,
  Twitter,
  X,
} from "lucide-react";
import React, { createContext, useRef, useState } from "react";
import Logo from "./Logo";
import Constants from "@/lib/constants";

interface ISidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  SidebarBurger: ({ className }: { className?: string }) => React.JSX.Element;
}

const SidebarContext = createContext<ISidebarContext | null>(null);

const WIDTH_MODES = {
  SMALL: "300px",
  LARGE: "90vw",
};

type WidthModesType = "SMALL" | "LARGE";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [widthMode, setWidthMode] = useState<WidthModesType>("SMALL");
  const width = WIDTH_MODES[widthMode as keyof typeof WIDTH_MODES];

  function toggleWidthModes() {
    setWidthMode((prev) => {
      switch (prev) {
        case "SMALL":
          return "LARGE";
        case "LARGE":
          return "SMALL";
        default:
          return "SMALL";
      }
    });
  }

  function toggleSidebar() {
    setWidthMode("SMALL");
    setOpen((prev) => !prev);
  }

  function close() {
    setWidthMode("SMALL");
    setOpen(false);
  }

  // AUTO CLOSE WHEN CLICK OUTSIDE
  const SidebarRef = useRef(null);
  const SidebarBurgerRef = useRef(null);
  useDetectOutsideClick<any>(SidebarRef, close, SidebarBurgerRef);

  function SidebarBurger({ className }: { className?: string }) {
    return (
      <div
        ref={SidebarBurgerRef}
        onClick={toggleSidebar}
        className={cn(
          "cursor-pointer flex items-center justify-center gap-1",
          className
        )}
      >
        <Menu />
        <span>Explore</span>
      </div>
    );
  }

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggleSidebar, SidebarBurger }}
    >
      <div
        ref={SidebarRef}
        style={{
          width: width,
          left: open ? 0 : `-${width}`,
        }}
        className={cn(
          "fixed text-white top-0 flex p-2 flex-col bg-[#172125] transition-all duration-300 h-screen shadow-lg z-[9999999999999]"
        )}
      >
        <div className="relative flex items-center py-2 justify-center">
          <X
            onClick={close}
            className="absolute top-0 right-0 cursor-pointer"
          />
          <Logo className="w-[200px] h-[60px]" />
        </div>
        <div className="flex justify-end pt-2">
          <div
            onClick={toggleWidthModes}
            className="flex items-center justify-center gap-2 cursor-pointer text-white"
          >
            <span>{widthMode === "SMALL" ? "Expand" : "Shrink"}</span>
            <ArrowRight
              className={cn({
                "": widthMode === "SMALL",
                "rotate-180": widthMode === "LARGE",
              })}
            />
          </div>
        </div>
        <div className="pb-2 pt-4 overflow-y-auto hide_scrollbar mt-2 flex flex-wrap gap-4">
          {Constants.subHeaders?.map((subHeader, idx) => {
            return (
              <div
                key={`${idx}-${subHeader.label}`}
                className="min-w-[140px] cursor-pointer hover:underline font-semibold text-nowrap"
              >
                {subHeader.label}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center p-2 mt-auto gap-2">
          <Facebook />
          <Twitter />
          <Instagram />
        </div>
      </div>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export default Sidebar;
