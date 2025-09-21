import { NextRequest, NextResponse } from "next/server";
import { fetchHostawayReviews, normalizeReviewData } from "@/lib/hostaway";

export async function GET(request: NextRequest) {
  try {
    // Fetch reviews from Hostaway API (or mock data)
    const hostawayData = await fetchHostawayReviews();

    // Normalize the review data to our application format
    const normalizedReviews = normalizeReviewData(hostawayData);

    // Return the exact format specified in requirements
    return NextResponse.json({
      status: "success",
      data: normalizedReviews,
      count: normalizedReviews.length,
      metadata: {
        source: "hostaway",
        fetchedAt: new Date().toISOString(),
        originalCount: hostawayData.result.length,
      },
    });
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch reviews from Hostaway",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    );
  }
}
