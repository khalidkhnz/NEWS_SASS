"use client";

import useDebounce from "@/hooks/useDebounce";
import Assets from "@/lib/Assets";
import { cn } from "@/lib/utils";
import {
  ChevronLeftCircle,
  CopyPlus,
  GaugeIcon,
  ImagesIcon,
  LayoutDashboard,
  LogOut,
  LogOutIcon,
  Menu,
  SettingsIcon,
  SquareStack,
  Table2Icon,
  Tag,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useState } from "react";

interface ICmsSidebarContextProps {}

const CmsSidebarContext = createContext<ICmsSidebarContextProps | null>(null);

const CmsSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const debouncedOpen = useDebounce(isOpen, 200);

  function toggleOpen() {
    setIsOpen((p) => !p);
  }

  const ITEMS = pathname.startsWith("/admin")
    ? AdminSidebarItems
    : SidebarItems;

  return (
    <CmsSidebarContext.Provider value={{}}>
      <div className="w-full flex">
        <div
          className={cn(
            "transition-all duration-300 relative h-screen bg-neutral-800 border-r-[1px] border-neutral-900 flex flex-col gap-2",
            {
              "min-w-[300px] w-[300px] pr-6 p-2": isOpen,
              "w-[70px] py-2 pl-2": !isOpen,
            }
          )}
        >
          <div
            className={cn("relative w-[80%] h-[40px] p-2 mb-4", {
              "mix-blend-difference": isOpen,
            })}
          >
            {isOpen && (
              <Image
                src={Assets.HEADER_LOGO}
                alt="logo"
                className="object-contain"
                fill
              />
            )}
            {!isOpen && (
              <Menu
                onClick={toggleOpen}
                className="text-white w-10 h-10 cursor-pointer"
              />
            )}
          </div>

          <ChevronLeftCircle
            onClick={toggleOpen}
            className={cn(
              "absolute w-7 h-7 cursor-pointer top-4 z-[99999999] -right-3 bg-purple-700 rounded-full text-white p-[1px] border-purple-950",
              {
                hidden: !isOpen,
              }
            )}
          />

          {ITEMS.map((item, idx) => {
            const Icon = item.icon;

            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                href={item.href}
                key={`${idx}-${item.label}`}
                className={cn(
                  "border-l-8 h-[50px] relative text-white bg-neutral-700 cursor-pointer p-2 gap-2 flex items-center justify-start px-4",
                  {
                    "shadow-md text-black bg-gray-200 border-purple-700":
                      isActive,
                  }
                )}
              >
                <Icon
                  className={cn({
                    "absolute left-[15px]": !isOpen,
                  })}
                />
                {isOpen && debouncedOpen && (
                  <span className="text-nowrap">{item?.label}</span>
                )}
              </Link>
            );
          })}
        </div>
        {children}
      </div>
    </CmsSidebarContext.Provider>
  );
};

const SidebarItems = [
  { label: "Dashboard", href: "/cms/dashboard", icon: LayoutDashboard },
  { label: "Manage Posts", href: "/cms/posts", icon: CopyPlus },
  {
    label: "Manage Categories",
    href: "/cms/categories",
    icon: SquareStack,
  },
  { label: "Gallery", href: "/cms/gallery", icon: ImagesIcon },
  { label: "Profile", href: "/cms/profile", icon: User2 },
  { label: "Signout", href: "/signout", icon: LogOut },
];

const AdminSidebarItems = [
  { label: "Admin", href: "/admin", icon: GaugeIcon },
  { label: "Users", href: "/admin/users", icon: Table2Icon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
  { label: "Sign out", href: "/signout", icon: LogOutIcon },
];

export default CmsSidebar;
