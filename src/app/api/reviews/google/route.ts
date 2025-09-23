import { NextResponse } from "next/server";
import {
  fetchGoogleReviews,
  normalizeGoogleReviewData,
  getPropertyPlaceIds,
  type NormalizedGoogleReview,
} from "@/lib/google-places";

export async function GET() {
  try {
    const placeIdsMap = getPropertyPlaceIds();
    const placeIds = Object.values(placeIdsMap);

    const allNormalizedReviews: NormalizedGoogleReview[] = [];

    // Fetch reviews for each place ID
    for (const placeId of placeIds) {
      const googleData = await fetchGoogleReviews(placeId);
      const normalizedReviews = normalizeGoogleReviewData(googleData);
      allNormalizedReviews.push(...normalizedReviews);
    }

    return NextResponse.json({
      status: "success",
      data: allNormalizedReviews,
      count: allNormalizedReviews.length,
      source: "google_places_api",
    });
  } catch (error) {
    console.error("Google Reviews API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: [],
        count: 0,
      },
      { status: 500 },
    );
  }
}
