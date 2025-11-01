"use client";

export function BlogPostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Content skeleton */}
      <div className="p-6 flex flex-col grow">
        {/* Date skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-6 grow">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        {/* Read more skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-auto"></div>
      </div>
    </div>
  );
}

export function BlogSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }, (_, i) => (
        <BlogPostSkeleton key={i} />
      ))}
    </div>
  );
}