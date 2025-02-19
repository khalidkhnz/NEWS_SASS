import Assets from "@/lib/Assets";
import PostCard from "./PostCard";

export default function FeaturedPost({ type }: { type: "SMALL" | "LARGE" }) {
  return (
    <div className="flex flex-wrap gap-4">
      {type === "SMALL" &&
        Array.from({ length: 6 })
          .fill(0)
          .map((_, idx) => {
            return (
              <PostCard
                title="Featured Post / Top News / World News"
                rightImage={idx % 2 === 0 ? undefined : Assets.DUMMY}
                leftImage={idx % 2 === 0 ? Assets.DUMMY : undefined}
                key={idx}
                className="border-[1px] rounded-sm p-3"
              />
            );
          })}

      {type === "LARGE" &&
        Array.from({ length: 3 })
          .fill(0)
          .map((_, idx) => {
            return (
              <PostCard
                title="Featured Post / Top News / World News"
                topImage={Assets.DUMMY}
                key={idx}
                className="border-[1px] rounded-sm p-3"
              />
            );
          })}
    </div>
  );
}
