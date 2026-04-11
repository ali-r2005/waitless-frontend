import { MetadataRoute } from "next";
import { APP_URL } from "./app.url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = APP_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

