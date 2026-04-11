import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://waitless-app.vercel.app"; // Update with your domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/dashboard/", "/unauthorized/", "/profile/", "/queue/", "/staff/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
