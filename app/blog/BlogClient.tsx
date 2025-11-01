"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/contentful";
import { BlogPostSkeleton } from "./BlogSkeleton";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialHasMore: boolean;
}

export function BlogClient({ initialPosts, initialHasMore }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/blog?page=${page + 1}&limit=9`);
      const data = await response.json();

      if (data.posts) {
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.pagination.hasMore);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMore, loading]);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Berlin Business Growth Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Strategic insights, proven techniques, and actionable advice to help your Berlin business thrive in the digital world
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.sys.id}
                  href={`/blog/${post.fields.slug}`}
                  className="group block h-full"
                >
                  <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    {post.fields.featuredImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={`https:${post.fields.featuredImage.fields.file.url}`}
                          alt={
                            post.fields.featuredImage.fields.title ||
                            post.fields.title
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col grow">
                      <div className="mb-3">
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
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.fields.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 grow">
                        {post.fields.excerpt ||
                          post.fields.subtitle ||
                          "No description available"}
                      </p>

                      <div className="inline-flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium transition-colors mt-auto">
                        Read more
                        <svg
                          className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
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
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {Array.from({ length: 3 }, (_, i) => (
                  <BlogPostSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div id="load-more-trigger" className="flex justify-center items-center py-8">
                {!loading && (
                  <button
                    onClick={loadMorePosts}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Load More Posts
                  </button>
                )}
              </div>
            )}

            {!hasMore && posts.length > 9 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  You&apos;ve reached the end! 🎉
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}