import { getAllPostsSlugs } from "@/actions/post/get-all-posts-slugs";
import { FULL_DOMAIN_NAME } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPostsSlugs();

  const allPostsSiteMap: MetadataRoute.Sitemap = slugs?.map((slug: string) => {
    return {
      url: `${FULL_DOMAIN_NAME}/post/${slug}`,
      lastModified: new Date(),
      changeFrequency: `always`,
      priority: 0.8,
    };
  });

  return [
    {
      url: `${FULL_DOMAIN_NAME}`,
      lastModified: new Date(),
      changeFrequency: `always`,
      priority: 1,
    },
    ...allPostsSiteMap,
  ];
}
