import { BlogSkeletonGrid } from "./BlogSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-2xl mx-auto animate-pulse"></div>
        </div>

        <BlogSkeletonGrid />
      </div>
    </div>
  );
}
