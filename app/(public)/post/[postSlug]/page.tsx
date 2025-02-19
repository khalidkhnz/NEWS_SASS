import { incrementPostViews } from "@/actions/post/increment-post-views";
import Preview from "@/components/news/Preview";
import { getPostBySlug } from "@/queries/posts-queries";
import React from "react";

interface Props {
  params: Promise<{
    postSlug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const postSlug = decodeURIComponent((await params).postSlug);

  const postData = await getPostBySlug(postSlug).then((res) => {
    incrementPostViews({}, postSlug);
    return res;
  });

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
};

export default Page;
