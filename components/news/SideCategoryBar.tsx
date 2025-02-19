import { cn, postUrlWithSlug } from "@/lib/utils";
import Headings from "./Headings";
import PostCard from "./PostCard";
import { GetPostsResponse } from "@/actions/post/get-posts";

export default function SideCategoryBar({
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
        "shadow-2xl hidden hide_scrollbar sticky overflow-y-auto md:flex flex-col gap-8 top-[50px] h-[calc(100vh-65px)] bg-white w-[260px] p-2",
        {
          "rounded-l-md": position === "left",
          "rounded-r-md": position === "right",
        }
      )}
    >
      <Headings>Trending News</Headings>
      {PostData.map((post, idx) => {
        return (
          <PostCard
            href={postUrlWithSlug(post?.slug)}
            title={post.title}
            content={post.description}
            key={`Right-SideBarCard-key-${idx}`}
          />
        );
      })}
    </div>
  );
}
