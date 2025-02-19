import { cn } from "@/lib/utils";
import Headings from "./Headings";
import PostCard from "./PostCard";

export default function SideCategoryBar({
  position,
}: {
  position: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "shadow-2xl hidden hide_scrollbar sticky overflow-y-auto md:flex flex-col gap-8 top-[50px] h-[calc(100vh-65px)] bg-white w-[260px] p-2",
        {
          "rounded-l-md": position === "left",
          "rounded-r-md": position === "right",
        }
      )}
    >
      <Headings>TOP NEWS</Headings>
      {Array.from({ length: 20 })
        .fill(0)
        .map((_, idx) => {
          return <PostCard key={`Right-SideBarCard-key-${idx}`} />;
        })}
    </div>
  );
}
