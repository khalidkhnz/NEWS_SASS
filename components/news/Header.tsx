"use client";

import { Fragment } from "react";
import WeatherHeader from "./WeatherHeader";
import SubHeader from "./SubHeader";
import { useSidebar } from "./Sidebar";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

export default function Header() {
  const { SidebarBurger } = useSidebar();

  return (
    <Fragment>
      <WeatherHeader />
      <div className="relative bg-gradient-to-tr text-white from-[#011E29] to-[#001F29] w-[99%] flex items-center justify-center mx-auto rounded-t-lg p-2 border-[2px] border-gray-200 h-[120px] ">
        <SidebarBurger className="absolute left-4 bottom-4" />
        <SearchBar className="absolute right-4 bottom-4" />
        <Logo className="w-[240px] h-[70px] sm:w-[370px] sm:h-[75px] md:w-[420px] md:h-[90px]" />
      </div>
      <SubHeader />
      <div className="border-b-2 border-gray-200 my-2" />
    </Fragment>
  );
}
