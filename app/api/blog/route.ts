import { NextRequest, NextResponse } from "next/server";
import { getBlogPostsPaginated } from "@/lib/contentful";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");
  const skip = (page - 1) * limit;

  try {
    const result = await getBlogPostsPaginated(skip, limit);

    return NextResponse.json({
      posts: result.posts,
      pagination: {
        page,
        limit,
        total: result.total,
        hasMore: result.hasMore,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error in blog API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
