import { cn } from "@/lib/utils";
import React from "react";
import { Search } from "lucide-react";
import CustomDialog from "./CustomDialog";
import { Input } from "../ui/input";
import { DialogClose } from "../ui/dialog";
import { Label } from "../ui/label";
import Headings from "./Headings";

const SearchBar = ({ className }: { className?: string }) => {
  return (
    <CustomDialog
      TRIGGER={
        <div
          className={cn(
            "flex items-center justify-center gap-1 cursor-pointer",
            className
          )}
        >
          <Search />
          <span>Search</span>
        </div>
      }
      CONTENT={
        <div className="w-[400px] mt-2 px-2 h-[145px]">
          <Label htmlFor="search">
            <Headings className="my-4">SEARCH NEWS</Headings>
          </Label>
          <Input id="search" placeholder="Search" className="border-primary" />
          <div className="flex justify-end gap-2 mt-5">
            <DialogClose
              onClick={() => alert("SEARCH")}
              className="bg-primary text-white px-2 py-1 rounded-sm h-8 w-[100px]"
            >
              Search
            </DialogClose>
          </div>
        </div>
      }
    />
  );
};

export default SearchBar;
