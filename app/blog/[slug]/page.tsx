import { getBlogPost, getBlogPosts } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, Document } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic rendering to show new posts immediately
export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Rich text rendering options
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className="font-semibold">{text}</strong>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_: unknown, children: React.ReactNode) => (
      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_1]: (_: unknown, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (_: unknown, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_: unknown, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_: unknown, children: React.ReactNode) => (
      <li className="text-gray-700 dark:text-gray-300">{children}</li>
    ),
  },
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.fields.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to blog link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        <article>
          {/* Featured Image */}
          {post.fields.featuredImage && (
            <div className="aspect-video relative mb-8 rounded-2xl overflow-hidden">
              <Image
                src={`https:${post.fields.featuredImage.fields.file.url}`}
                alt={
                  post.fields.featuredImage.fields.title || post.fields.title
                }
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <time
                dateTime={post.fields.publishedDate}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {new Date(post.fields.publishedDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </time>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                By{" "}
                {typeof post.fields.author === "string"
                  ? post.fields.author
                  : "Anonymous"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.fields.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {post.fields.excerpt ||
                post.fields.subtitle ||
                "No description available"}
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-headings:mb-6 prose-headings:mt-8">
            {post.fields.content &&
              documentToReactComponents(
                post.fields.content as Document,
                richTextOptions
              )}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Need help with your website?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                I help Berlin businesses grow through better web presence.
                Let&apos;s discuss your project.
              </p>
              <Link href="/#contact" className="btn-primary-animated">
                <span className="font-semibold">Get in touch</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
