// Google Places API Integration for Reviews
import { env } from "@/env";

// Google Places API Response Types
export interface GooglePlacesReview {
  author_name: string;
  author_url?: string;
  language: string;
  original_language?: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

export interface GooglePlacesApiResponse {
  html_attributions: string[];
  result: {
    name: string;
    place_id: string;
    formatted_address?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GooglePlacesReview[];
  };
  status: string;
}

// Normalized interfaces (matching existing structure)
export interface NormalizedGoogleReview {
  id: string;
  externalId: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number;
  overallRating: number;
  comment: string;
  channel: "google";
  reviewType: "guest-to-host";
  status: "published";
  isApproved: boolean;
  submittedAt: Date;
  categories: NormalizedGoogleCategory[];
}

export interface NormalizedGoogleCategory {
  id: string;
  category: "overall";
  rating: number; // 1-10 scale
  normalizedRating: number; // 1-5 scale
}

export interface NormalizedGoogleProperty {
  id: string;
  externalId: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
}

/**
 * Fetch Google Reviews using Places API
 * @param placeId - Google Place ID for the property
 * @returns Promise<GooglePlacesApiResponse>
 */
export async function fetchGoogleReviews(
  placeId: string,
): Promise<GooglePlacesApiResponse> {
  const apiKey = env.GOOGLE_REVIEWS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Reviews API key not configured");
  }

  const fields =
    "name,place_id,formatted_address,rating,user_ratings_total,reviews";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Google Places API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as GooglePlacesApiResponse;

    if (data.status !== "OK") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching Google reviews:", error);

    // Return mock data for development/testing
    if (env.NODE_ENV === "development") {
      return getMockGoogleData(placeId);
    }

    throw error;
  }
}

/**
 * Generate mock Google Reviews data for development
 * @param placeId - Google Place ID
 * @returns Mock GooglePlacesApiResponse
 */
export function getMockGoogleData(placeId: string): GooglePlacesApiResponse {
  return {
    html_attributions: [],
    result: {
      name: "Flex Living Property - Mock",
      place_id: placeId,
      formatted_address: "123 Mock Street, London, UK",
      rating: 4.3,
      user_ratings_total: 127,
      reviews: [
        {
          author_name: "Sarah Johnson",
          author_url: "https://www.google.com/maps/contrib/mock1",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/mock1",
          rating: 5,
          relative_time_description: "2 weeks ago",
          text: "Excellent stay! The apartment was spotless and exactly as described. Great location with easy access to public transport. The host was very responsive and helpful throughout our stay.",
          time: Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60, // 2 weeks ago
        },
        {
          author_name: "Michael Chen",
          author_url: "https://www.google.com/maps/contrib/mock2",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/mock2",
          rating: 4,
          relative_time_description: "1 month ago",
          text: "Good value for money. The place was clean and comfortable. Only minor issue was the WiFi was a bit slow, but overall a pleasant experience.",
          time: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 1 month ago
        },
        {
          author_name: "Emma Williams",
          author_url: "https://www.google.com/maps/contrib/mock3",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/mock3",
          rating: 5,
          relative_time_description: "2 months ago",
          text: "Perfect location in the heart of the city! Walking distance to restaurants, shops, and attractions. The apartment was modern and well-equipped. Highly recommend!",
          time: Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60, // 2 months ago
        },
        {
          author_name: "David Brown",
          author_url: "https://www.google.com/maps/contrib/mock4",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/mock4",
          rating: 3,
          relative_time_description: "3 months ago",
          text: "The location was great but the apartment was smaller than expected. Cleanliness could be improved. The check-in process was smooth though.",
          time: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60, // 3 months ago
        },
        {
          author_name: "Lisa Anderson",
          author_url: "https://www.google.com/maps/contrib/mock5",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/mock5",
          rating: 4,
          relative_time_description: "4 months ago",
          text: "Great experience overall. The host provided clear instructions and was available when needed. The neighborhood is safe and convenient. Would stay again!",
          time: Math.floor(Date.now() / 1000) - 120 * 24 * 60 * 60, // 4 months ago
        },
      ],
    },
    status: "OK",
  };
}

/**
 * Normalize Google Places API data to match our review format
 * @param googleData - Raw Google Places API response
 * @returns Array of normalized reviews
 */
export function normalizeGoogleReviewData(
  googleData: GooglePlacesApiResponse,
): NormalizedGoogleReview[] {
  if (!googleData.result.reviews) {
    return [];
  }

  const propertyId = `google-${googleData.result.place_id}`;
  const propertyName = googleData.result.name;

  return googleData.result.reviews.map((review) => {
    const reviewId = `google-${review.time}-${review.author_name.replace(/\s+/g, "-").toLowerCase()}`;
    const normalizedRating = Math.round((review.rating / 5) * 10); // Convert 1-5 to 1-10 scale

    return {
      id: reviewId,
      externalId: `google-${review.time}`,
      propertyId,
      propertyName,
      guestName: review.author_name,
      rating: review.rating, // Keep original 1-5 scale for display
      overallRating: review.rating, // Keep original 1-5 scale
      comment: review.text,
      channel: "google" as const,
      reviewType: "guest-to-host" as const,
      status: "published" as const,
      isApproved: false, // Default to unapproved for manager review
      submittedAt: new Date(review.time * 1000), // Convert Unix timestamp to Date
      categories: [
        {
          id: `${reviewId}-overall`,
          category: "overall" as const,
          rating: normalizedRating, // 1-10 scale for consistency
          normalizedRating: review.rating, // 1-5 scale for display
        },
      ],
    };
  });
}

/**
 * Extract property information from Google Places data
 * @param googleData - Raw Google Places API response
 * @returns Normalized property data
 */
export function extractPropertyFromGoogleData(
  googleData: GooglePlacesApiResponse,
): NormalizedGoogleProperty {
  const { result } = googleData;

  // Extract city and country from formatted address
  const addressParts = result.formatted_address?.split(", ") ?? [];
  const city =
    addressParts.length >= 2
      ? (addressParts[addressParts.length - 2] ?? null)
      : null;
  const country =
    addressParts.length >= 1
      ? (addressParts[addressParts.length - 1] ?? null)
      : null;

  return {
    id: `google-${result.place_id}`,
    externalId: result.place_id,
    name: result.name,
    address: result.formatted_address ?? null,
    city,
    country,
    description: `Google Reviews property with ${result.user_ratings_total ?? 0} total reviews and ${result.rating ?? 0} average rating.`,
  };
}

/**
 * Get available Google Place IDs for properties
 * This would typically come from your property management system
 * For now, returning mock data for demonstration
 */
export function getPropertyPlaceIds(): Record<string, string> {
  return {
    // propertyId: placeId mapping
    "hostaway-property-1": "ChIJrTLr-GyuEmsRBfy61i59si0", // Example Sydney place ID
    "hostaway-property-2": "ChIJN1t_tDeuEmsRUsoyG83frY4", // Example Melbourne place ID
    "hostaway-property-3": "ChIJdd4hrwug2EcRmSrV3Vo6llI", // Example London place ID
  };
}
