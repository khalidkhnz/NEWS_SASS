import { getPosts } from "@/actions/post/get-posts";
import { incrementPostViews } from "@/actions/post/increment-post-views";
import Preview from "@/components/news/Preview";
import { Tags } from "@/lib/constants";
import { unstable_cache } from "next/cache";

const getCachedLatestPosts = unstable_cache(
  () =>
    getPosts({
      limit: 1,
      page: 1,
      sortKey: "updatedAt",
    }),
  [],
  { tags: [Tags.latestPosts] }
);

export default async function Page() {
  const post = await getCachedLatestPosts().then((res) => {
    const slug = res?.data?.[0]?.slug || null;
    if (slug) {
      incrementPostViews({}, slug);
    }
    return res;
  });

  const postData = post?.data?.[0] || null;

  if (!postData) return "Error fetching post";

  return (
    <div className="bg-white p-2 pt-6">
      <h1 className="text-2xl font-bold text-neutral-600 pb-2">
        {postData?.title || ""}
      </h1>
      <p className="line-clamp-2 font-normal text-xs text-neutral-800 mb-8">
        {postData?.description || ""}
      </p>
      <Preview delta={JSON.parse(postData?.delta || "")} />
    </div>
  );
}
