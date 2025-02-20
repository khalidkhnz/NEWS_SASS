import { getAllPostsSlugs } from "@/actions/post/get-all-posts-slugs";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fullDomain = "https://news.khalidkhnz.in";

  const slugs = await getAllPostsSlugs();

  const allPostsSiteMap: MetadataRoute.Sitemap = slugs?.map((slug: string) => {
    return {
      url: `${fullDomain}/post/${slug}`,
      lastModified: new Date(),
      changeFrequency: `always`,
      priority: 0.8,
    };
  });

  return [
    {
      url: `${fullDomain}`,
      lastModified: new Date(),
      changeFrequency: `always`,
      priority: 1,
    },
    ...allPostsSiteMap,
  ];
}
