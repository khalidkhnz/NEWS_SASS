import { getPosts } from "@/actions/post/get-posts";
import { incrementPostViews } from "@/actions/post/increment-post-views";
import ParsedPreview from "@/components/news/ParsedPreview";
import { Separator } from "@/components/ui/separator";
import { generateMetadataUtil } from "@/lib/metadata";
import { formatDateString, safeJSONparse } from "@/lib/utils";
import { LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon, Share2 } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";

const getCachedLatestPosts = () => {
  return getPosts({
    limit: 1,
    page: 1,
    sortKey: "updatedAt",
    status: "PUBLISHED",
    withAuthor: true,
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

  if (!postData || !postData?.delta)
    return (
      <div className="flex items-center justify-center">
        There is no posts, as of now.
      </div>
    );

  const parsedDelta = safeJSONparse(postData?.parsedDelta || "");

  return (
    <div className="bg-white p-2 pt-6">
      <h1 className="text-3xl font-bold text-neutral-800 pb-2">
        {postData?.title || ""}
      </h1>
      <div className="mb-8">
        <span className="text-sm text-neutral-500">
          By{" "}
          <span className="underline text-neutral-700">
            {(postData as any)?.authorInfo?.name}
          </span>
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

export const dynamic = "force-dynamic";
