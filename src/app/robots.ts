import { MetadataRoute } from "next";
import { APP_URL } from "./app.url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/dashboard/", "/unauthorized/", "/profile/", "/queue/", "/staff/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

