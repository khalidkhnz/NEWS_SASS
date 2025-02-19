import PostCard from "./PostCard";
import { GetPostsResponse } from "@/actions/post/get-posts";
import { postUrlWithSlug } from "@/lib/utils";

export default function FeaturedPost({
  type,
  posts,
}: {
  type: "SMALL" | "LARGE";
  posts?: GetPostsResponse;
}) {
  const PostData = posts?.data || [];

  return (
    <div className="flex flex-wrap gap-4">
      {type === "SMALL" &&
        PostData.map((post, idx) => {
          return (
            <PostCard
              href={postUrlWithSlug(post?.slug)}
              title={post?.title}
              rightImage={idx % 2 === 0 ? undefined : post.thumbnail || ""}
              leftImage={idx % 2 === 0 ? post.thumbnail || "" : undefined}
              key={idx}
              content={post?.description}
              className="border-[1px] rounded-sm p-3"
            />
          );
        })}

      {type === "LARGE" &&
        PostData.map((post, idx) => {
          return (
            <PostCard
              href={postUrlWithSlug(post?.slug)}
              title={post?.title}
              topImage={post.thumbnail || ""}
              key={idx}
              content={post?.description}
              className="border-[1px] rounded-sm p-3"
            />
          );
        })}
    </div>
  );
}
