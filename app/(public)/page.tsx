import { getPosts } from "@/actions/post/get-posts";
import { incrementPostViews } from "@/actions/post/increment-post-views";
import ParsedPreview from "@/components/news/ParsedPreview";
import { generateMetadataUtil } from "@/lib/metadata";
import { safeJSONparse } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";

const getCachedLatestPosts = () => {
  return getPosts({
    limit: 1,
    page: 1,
    sortKey: "updatedAt",
  });
};

export default async function Page() {
  const post = await getCachedLatestPosts().then((res) => {
    const slug = res?.data?.[0]?.slug || null;
    if (slug) {
      incrementPostViews({}, slug);
    }
    return res;
  });

  const postData = post?.data?.[0] || null;

  if (!postData || !postData?.delta) return "Error fetching post";

  const parsedDelta = safeJSONparse(postData?.parsedDelta || "");

  return (
    <div className="bg-white p-2 pt-6">
      <h1 className="text-2xl font-bold text-neutral-600 pb-2">
        {postData?.title || ""}
      </h1>
      <p className="line-clamp-2 font-normal text-xs text-neutral-800 mb-8">
        {postData?.description || ""}
      </p>
      {typeof parsedDelta != "string" && (
        <ParsedPreview parsedDelta={parsedDelta} />
      )}
    </div>
  );
}

type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const Promise = generateMetadataUtil("HOME");
  return Promise({ params, searchParams }, parent);
}
