import { cn } from "@/lib/utils";
import Headings from "./Headings";
import PostCard from "./PostCard";
import Assets from "@/lib/Assets";

export default function SideCategoryBar2({
  position,
}: {
  position: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "shadow-2xl hidden hide_scrollbar sticky overflow-y-auto md:flex flex-col gap-8 top-[50px] h-[calc(100vh-65px)] bg-white w-[360px] p-2",
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
          return (
            <PostCard
              rightImageClassName="min-w-[120px] min-h-[70px]"
              rightImage={Assets.DUMMY}
              key={`Right-SideBarCard-key-${idx}`}
            />
          );
        })}
    </div>
  );
}
