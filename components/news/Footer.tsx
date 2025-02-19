import React from "react";
import Logo from "./Logo";
import Constants from "@/lib/constants";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0D2833] flex flex-col gap-2 p-2 rounded-t-lg mt-4 border-[2px] w-full h-[400px]">
      <div className="p-4">
        <Logo />
      </div>
      <Seperator />
      <div className="text-white h-[120px] p-2 overflow-y-auto hide_scrollbar grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {Constants.subHeaders?.map((subHeader, idx) => {
          return (
            <div
              key={`${idx}-${subHeader.label}`}
              className="h-[20px] cursor-pointer hover:underline line-clamp-1"
            >
              {subHeader.label}
            </div>
          );
        })}
      </div>
      <Seperator />
      <div className="flex justify-center items-center p-2 gap-4">
        <div className="text-white cursor-pointer hover:underline  text-nowrap">
          Privacy Policy
        </div>
        <div className="text-white cursor-pointer hover:underline  text-nowrap">
          Terms of Use
        </div>
        <div className="text-white cursor-pointer hover:underline  text-nowrap">
          Contact Us
        </div>
      </div>
      <Seperator />
      <div className="text-white flex justify-center items-center p-2 mt-auto gap-2">
        <Facebook />
        <Twitter />
        <Instagram />
      </div>
    </footer>
  );
};

function Seperator() {
  return (
    <div className="flex flex-col gap-[1px] w-full">
      <div className="w-full border-b-[1px] border-white" />
      <div className="w-full border-b-[1px] border-white" />
      <div className="w-full border-b-[1px] border-white" />
    </div>
  );
}

export default Footer;
