import { getPostBySlug } from "@/queries/posts-queries";
import type { Metadata, ResolvingMetadata } from "next";
import { safeJSONparse } from "./utils";
import { APP_DESCRIPTION, APP_NAME, FULL_DOMAIN_NAME } from "./constants";

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
        description: meta?.description || APP_DESCRIPTION,
        openGraph: {
          images: [`${FULL_DOMAIN_NAME}/logo.png`],
          ...meta?.openGraph,
        },
        authors: [{ name: "", url: `/news/post/${""}` }],
        category: "",
        applicationName: APP_NAME,
        keywords: [],
      };
    }

    if (TYPE == "EXPLORE") {
      return {
        ...meta,
        title: meta?.title || `Explore`,
        description: meta?.description || APP_DESCRIPTION,
        openGraph: {
          images: [`${FULL_DOMAIN_NAME}/logo.png`],
          ...meta?.openGraph,
        },
        authors: [{ name: "", url: `/news/post/${""}` }],
        category: "",
        applicationName: APP_NAME,
        keywords: [],
      };
    }

    if (TYPE == "OTHER") {
      return {
        ...meta,
        title: meta?.title || ``,
        description: meta?.description || APP_DESCRIPTION,
        openGraph: {
          images: [`${FULL_DOMAIN_NAME}/logo.png`],
          ...meta?.openGraph,
        },
        authors: [{ name: "", url: `/news/post/${""}` }],
        category: "",
        applicationName: APP_NAME,
        keywords: [],
      };
    }

    // For Posts
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
        images: [post?.thumbnail || `${FULL_DOMAIN_NAME}/logo.png`],
      },
      authors: [
        {
          name: post?.author || "",
          url: `${FULL_DOMAIN_NAME}/news/post/${post?.slug}`,
        },
      ],
      category: post?.categories.join(", "),
      applicationName: APP_NAME,
      keywords: [...keywords, ...(post?.categories || [])],
    };
  };
