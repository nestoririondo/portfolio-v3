import { getBlogPostsPaginated } from "@/lib/contentful";
import type { Metadata } from "next";
import { BlogClient } from "./BlogClient";

// Force dynamic rendering to show new posts immediately
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berlin Business Growth Hub | Néstor Iriondo - Web Developer",
  description: "Strategic insights, proven techniques, and actionable advice to help your Berlin business thrive in the digital world. Web development tips from an experienced Berlin developer.",
  keywords: ["Berlin business growth", "web development insights", "digital strategy", "business tips", "Berlin entrepreneur", "website optimization", "digital transformation"],
  openGraph: {
    title: "Berlin Business Growth Hub",
    description: "Strategic insights and actionable advice to help your Berlin business thrive in the digital world.",
    type: "website",
  },
};

export default async function BlogPage() {
  const initialData = await getBlogPostsPaginated(0, 9);

  return (
    <BlogClient 
      initialPosts={initialData.posts || []}
      initialHasMore={initialData.hasMore || false}
    />
  );
}
