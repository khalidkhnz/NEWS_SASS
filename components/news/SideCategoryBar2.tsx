import { cn, postUrlWithSlug, timeAgo } from "@/lib/utils";
import Headings from "./Headings";
import PostCard from "./PostCard";
import { GetPostsResponse } from "@/actions/post/get-posts";

export default function SideCategoryBar2({
  position,
  posts,
}: {
  posts?: GetPostsResponse;
  position: "left" | "right";
}) {
  const PostData = posts?.data || [];

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
      <Headings>Latest News</Headings>
      {PostData.map((post, idx) => {
        return (
          <PostCard
            href={postUrlWithSlug(post?.slug)}
            rightImageClassName="min-w-[120px] min-h-[70px]"
            rightImage={post?.thumbnail || ""}
            content={post?.description}
            title={post?.title}
            timestamp={`Updated ${timeAgo(post?.updatedAt)}`}
            key={`Right-SideBarCard-key-${idx}`}
          />
        );
      })}
    </div>
  );
}
