import { FULL_DOMAIN_NAME } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      //   disallow: "/private/",
    },
    sitemap: `${FULL_DOMAIN_NAME}/sitemap.xml`,
  };
}
