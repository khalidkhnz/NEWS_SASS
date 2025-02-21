import { getAllPostsSlugs } from "@/actions/post/get-all-posts-slugs";
import { incrementPostViews } from "@/actions/post/increment-post-views";
import ParsedPreview from "@/components/news/ParsedPreview";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateMetadataUtil } from "@/lib/metadata";
import { formatDateString, safeJSONparse } from "@/lib/utils";
import { getPostBySlug } from "@/queries/posts-queries";
import { LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon, Share, Share2 } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import React, { Fragment } from "react";

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
      <h1 className="text-3xl font-bold text-neutral-800 pb-2">
        {postData?.title || ""}
      </h1>
      <div className="mb-8">
        <span className="text-sm text-neutral-500">
          By{" "}
          <span className="underline text-neutral-700">{postData?.author}</span>
        </span>
        <Separator className="my-1 bg-neutral-400" />
        <div className="flex py-1 items-center justify-between">
          <span className="text-sm text-neutral-500">
            {formatDateString(postData?.createdAt)} IST
          </span>
          <span className="flex items-center justify-end gap-2">
            <FacebookIcon className="cursor-pointer hover:text-[#000] w-6 h-6 text-neutral-500" />
            <TwitterLogoIcon className="cursor-pointer hover:text-[#000] w-6 h-6 text-neutral-500" />
            <LinkedInLogoIcon className="cursor-pointer hover:text-[#000] w-6 h-6 text-neutral-500" />
            <Share2 className="cursor-pointer hover:text-[#000] w-6 h-6 text-neutral-500" />
          </span>
        </div>
      </div>
      {typeof parsedDelta != "string" && (
        <ParsedPreview parsedDelta={parsedDelta} />
      )}
      <section>
        {(() => {
          const parsedTags = safeJSONparse(postData?.tags);
          return (
            <div className="flex flex-col gap-2 p-2">
              <h4 className="font-semibold text-md text-center">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(parsedTags)
                  ? [...parsedTags, ...postData?.categories]
                  : [...postData?.categories]
                )?.map((tag) => {
                  return (
                    <Badge key={tag} className="bg-[#001F29]">
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>
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
