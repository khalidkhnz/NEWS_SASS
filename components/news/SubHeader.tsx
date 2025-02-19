import Constants from "@/lib/constants";
import React from "react";

const SubHeader = () => {
  return (
    <div className="sticky shadow-sm hide_scrollbar z-50 bg-white px-4 overflow-auto gap-10 flex items-center justify-around w-[99%] mx-auto rounded-b-lg top-0 h-[40px] border-[2px] border-gray-200">
      {Constants.subHeaders?.map((subHeader, idx) => {
        return (
          <div
            key={`${idx}-${subHeader.label}`}
            className="text-[#011E29] cursor-pointer hover:underline text-xs font-semibold text-nowrap"
          >
            {subHeader.label}
          </div>
        );
      })}
    </div>
  );
};

export default SubHeader;
