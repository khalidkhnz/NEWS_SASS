import { getAllPostsSlugs } from "@/actions/post/get-all-posts-slugs";
import { incrementPostViews } from "@/actions/post/increment-post-views";
import ParsedPreview from "@/components/news/ParsedPreview";
import { generateMetadataUtil } from "@/lib/metadata";
import { safeJSONparse } from "@/lib/utils";
import { getPostBySlug } from "@/queries/posts-queries";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

interface PageProps {
  params: Promise<{
    postSlug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const postSlug = decodeURIComponent((await params).postSlug);

  const postData = await getPostBySlug(postSlug).then((res) => {
    incrementPostViews({}, postSlug);
    return res;
  });

  if (!postData) return "Error fetching post";

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
};

export async function generateStaticParams() {
  const slugs = await getAllPostsSlugs();

  return slugs.map((postSlug) => ({
    postSlug,
  }));
}

type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const Promise = generateMetadataUtil("POST");
  return Promise({ params, searchParams }, parent);
}

export default Page;

export const dynamic = "force-dynamic";
