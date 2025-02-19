import { GetCategoriesResponse } from "@/actions/category/get-categories";
import Constants from "@/lib/constants";
import React from "react";

const SubHeader = ({ Categories }: { Categories?: GetCategoriesResponse }) => {
  return (
    <div className="sticky shadow-sm hide_scrollbar z-50 bg-white px-4 overflow-auto gap-10 flex items-center justify-around w-[99%] mx-auto rounded-b-lg top-0 h-[40px] border-[2px] border-gray-200">
      {Categories?.data?.map((category, idx) => {
        return (
          <div
            key={`${idx}-${category?.category}`}
            className="text-[#011E29] cursor-pointer hover:underline text-xs font-semibold text-nowrap"
          >
            {category?.category}
          </div>
        );
      })}
    </div>
  );
};

export default SubHeader;
