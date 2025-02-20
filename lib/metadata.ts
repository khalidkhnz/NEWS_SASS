import { getPostBySlug } from "@/queries/posts-queries";
import type { Metadata, ResolvingMetadata } from "next";
import { safeJSONparse } from "./utils";

type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type IMetaType = "POST" | "HOME" | "EXPLORE" | "OTHER";

export const generateMetadataUtil =
  (TYPE: IMetaType, meta?: Metadata) =>
  async (
    { params, searchParams }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> => {
    if (TYPE == "HOME") {
      return {
        ...meta,
        title: meta?.title || `Home`,
        description: meta?.description || "",
        openGraph: {
          images: ["/logo.png"],
          ...meta?.openGraph,
        },
        authors: [{ name: "", url: `/post/${""}` }],
        category: "",
        applicationName: "NewsApp",
        keywords: [],
      };
    }

    if (TYPE == "EXPLORE") {
      return {
        ...meta,
        title: meta?.title || `Explore`,
        description: meta?.description || "",
        openGraph: {
          images: ["/logo.png"],
          ...meta?.openGraph,
        },
        authors: [{ name: "", url: `/post/${""}` }],
        category: "",
        applicationName: "NewsApp",
        keywords: [],
      };
    }

    if (TYPE == "OTHER") {
      return {
        ...meta,
        title: ``,
        description: "",
        openGraph: { images: ["/logo.png"], ...meta?.openGraph },
        authors: [{ name: "", url: `/post/${""}` }],
        category: "",
        applicationName: "NewsApp",
        keywords: [],
      };
    }

    // Posts
    const postSlug = decodeURIComponent(((await params) as any)?.postSlug);
    const post = await getPostBySlug(postSlug);

    const parsedTags = safeJSONparse(post?.tags || "[]");
    const keywords = Array.isArray(parsedTags) ? parsedTags : [];

    return {
      ...meta,
      title: `${post?.title}`,
      description: post?.description || "",
      openGraph: {
        ...meta?.openGraph,
        images: [post?.thumbnail || "/logo.png"],
      },
      authors: [{ name: post?.author, url: `/post/${post?.slug}` }],
      category: post?.categories.join(", "),
      applicationName: "NewsApp",
      keywords: [...keywords, ...(post?.categories || [])],
    };
  };
