import { env } from "@/env";

const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";

// TypeScript interfaces for Hostaway API responses
export interface HostawayApiResponse {
  status: "success" | "error";
  result: HostawayReview[];
}

export interface HostawayReview {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string; // ISO date string
  guestName: string;
  listingName: string;
}

// Normalized review interface for our application
export interface NormalizedReview {
  id: string;
  externalId: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number | null;
  overallRating: number | null;
  comment: string;
  channel: "hostaway" | "google" | "airbnb";
  reviewType: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  isApproved: boolean;
  submittedAt: Date;
  categories: ReviewCategory[];
}

export interface ReviewCategory {
  id: string;
  category:
    | "cleanliness"
    | "communication"
    | "respect_house_rules"
    | "location"
    | "value";
  rating: number; // 1-10 scale from Hostaway
  normalizedRating: number; // 1-5 scale for display
}

export async function fetchHostawayReviews(): Promise<HostawayApiResponse> {
  try {
    const response = await fetch(`${HOSTAWAY_API_BASE}/reviews`, {
      headers: {
        Authorization: `Bearer ${env.HOSTAWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Hostaway API failed, returning mock data for development`);
      return getMockReviewData();
    }

    const data = (await response.json()) as HostawayApiResponse;
    return data;
  } catch (error) {
    console.error(
      `Hostaway API error: ${error as string} \n Returning mock data for development`,
      error,
    );
    return getMockReviewData();
  }
}

export function getMockReviewData(): HostawayApiResponse {
  return {
    status: "success",
    result: [
      {
        id: 7453,
        type: "guest-to-host",
        status: "published",
        rating: 9,
        publicReview:
          "Amazing property in the heart of Shoreditch! The location was perfect for exploring London, and the apartment was spotlessly clean. Communication with the host was excellent throughout our stay. Would definitely recommend!",
        reviewCategory: [
          { category: "cleanliness", rating: 10 },
          { category: "communication", rating: 10 },
          { category: "respect_house_rules", rating: 9 },
          { category: "location", rating: 10 },
          { category: "value", rating: 8 },
        ],
        submittedAt: "2024-08-21T22:45:14Z",
        guestName: "Shane Finkelstein",
        listingName: "2B N1 A - 29 Shoreditch Heights",
      },
      {
        id: 7454,
        type: "host-to-guest",
        status: "published",
        rating: null,
        publicReview:
          "Shane and family are wonderful guests! They treated the space with respect and left everything clean. Would definitely host again :)",
        reviewCategory: [
          { category: "cleanliness", rating: 10 },
          { category: "communication", rating: 10 },
          { category: "respect_house_rules", rating: 10 },
        ],
        submittedAt: "2024-08-21T22:45:14Z",
        guestName: "Shane Finkelstein",
        listingName: "2B N1 A - 29 Shoreditch Heights",
      },
      {
        id: 7455,
        type: "guest-to-host",
        status: "published",
        rating: 8,
        publicReview:
          "Great location and modern amenities. The apartment was exactly as described in the photos. Check-in process was smooth and the host was very responsive to our questions.",
        reviewCategory: [
          { category: "cleanliness", rating: 9 },
          { category: "communication", rating: 9 },
          { category: "respect_house_rules", rating: 8 },
          { category: "location", rating: 10 },
          { category: "value", rating: 7 },
        ],
        submittedAt: "2024-07-15T14:30:22Z",
        guestName: "Maria Rodriguez",
        listingName: "1B S2 C - 42 Camden Loft",
      },
      {
        id: 7456,
        type: "guest-to-host",
        status: "pending",
        rating: 10,
        publicReview:
          "Absolutely perfect stay! The property exceeded our expectations in every way. Beautiful interior design, excellent location, and the host went above and beyond to ensure we had everything we needed.",
        reviewCategory: [
          { category: "cleanliness", rating: 10 },
          { category: "communication", rating: 10 },
          { category: "respect_house_rules", rating: 10 },
          { category: "location", rating: 10 },
          { category: "value", rating: 9 },
        ],
        submittedAt: "2024-09-10T16:20:18Z",
        guestName: "James Thompson",
        listingName: "3B W1 A - 15 Notting Hill Residence",
      },
      {
        id: 7457,
        type: "guest-to-host",
        status: "published",
        rating: 6,
        publicReview:
          "The property was decent but had a few issues. The WiFi was slow and there were some maintenance issues with the shower. Location was good though.",
        reviewCategory: [
          { category: "cleanliness", rating: 7 },
          { category: "communication", rating: 8 },
          { category: "respect_house_rules", rating: 9 },
          { category: "location", rating: 8 },
          { category: "value", rating: 5 },
        ],
        submittedAt: "2024-06-28T11:15:45Z",
        guestName: "Lisa Chen",
        listingName: "1B E1 B - 28 Canary Wharf Studio",
      },
      {
        id: 7458,
        type: "guest-to-host",
        status: "published",
        rating: 4,
        publicReview:
          "Unfortunately, this stay didn't meet expectations. The apartment was not clean upon arrival, with dirty dishes in the sink and hair in the bathroom. The host was difficult to reach when we needed help. Very poor value for money.",
        reviewCategory: [
          { category: "cleanliness", rating: 3 },
          { category: "communication", rating: 4 },
          { category: "respect_house_rules", rating: 8 },
          { category: "location", rating: 7 },
          { category: "value", rating: 2 },
        ],
        submittedAt: "2024-05-12T09:30:15Z",
        guestName: "Robert Johnson",
        listingName: "2B N1 A - 29 Shoreditch Heights",
      },
      {
        id: 7459,
        type: "guest-to-host",
        status: "published",
        rating: 5,
        publicReview:
          "Mixed experience. The location is great and the space is nice, but communication with the host was poor. They didn't respond to our messages for hours, and the noise from the street was quite loud at night.",
        reviewCategory: [
          { category: "cleanliness", rating: 8 },
          { category: "communication", rating: 3 },
          { category: "respect_house_rules", rating: 7 },
          { category: "location", rating: 6 },
          { category: "value", rating: 6 },
        ],
        submittedAt: "2024-04-18T16:45:22Z",
        guestName: "Emma Wilson",
        listingName: "1B S2 C - 42 Camden Loft",
      },
      {
        id: 7460,
        type: "guest-to-host",
        status: "published",
        rating: 3,
        publicReview:
          "Very disappointing stay. The apartment was overpriced for what you get. The cleanliness was subpar, the host was unresponsive, and there were noise issues from neighbors. Would not recommend.",
        reviewCategory: [
          { category: "cleanliness", rating: 4 },
          { category: "communication", rating: 2 },
          { category: "respect_house_rules", rating: 6 },
          { category: "location", rating: 5 },
          { category: "value", rating: 2 },
        ],
        submittedAt: "2024-03-25T12:20:33Z",
        guestName: "David Brown",
        listingName: "3B W1 A - 15 Notting Hill Residence",
      },
    ],
  };
}

export function normalizeReviewData(
  hostawayData: HostawayApiResponse,
): NormalizedReview[] {
  return hostawayData.result.map((review) => {
    // Generate a unique property ID based on listing name
    const propertyId = generatePropertyId(review.listingName);

    // Calculate overall rating from categories (convert 1-10 to 1-5 scale)
    const overallRating =
      review.reviewCategory.length > 0
        ? review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0) /
          review.reviewCategory.length /
          2
        : review.rating
          ? review.rating / 2
          : null;

    return {
      id: crypto.randomUUID(),
      externalId: review.id.toString(),
      propertyId,
      propertyName: review.listingName,
      guestName: review.guestName,
      rating: review.rating,
      overallRating,
      comment: review.publicReview,
      channel: "hostaway",
      reviewType: review.type,
      status: review.status,
      isApproved: review.status === "published", // Auto-approve published reviews for now
      submittedAt: new Date(review.submittedAt),
      categories: review.reviewCategory.map((cat) => ({
        id: crypto.randomUUID(),
        category: cat.category as ReviewCategory["category"],
        rating: cat.rating,
        normalizedRating: cat.rating / 2, // Convert 1-10 to 1-5 scale
      })),
    };
  });
}

// Create a consistent property ID based on listing name
// This is a simple hash function - In production I'm going to use proper property mapping
function generatePropertyId(listingName: string): string {
  return listingName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Property normalization for mock data
export interface NormalizedProperty {
  id: string;
  externalId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
}

export function extractPropertiesFromReviews(
  reviews: NormalizedReview[],
): NormalizedProperty[] {
  const propertiesMap = new Map<string, NormalizedProperty>();

  reviews.forEach((review) => {
    if (!propertiesMap.has(review.propertyId)) {
      propertiesMap.set(review.propertyId, {
        id: review.propertyId,
        externalId: review.propertyId, // In real implementation, this would be the Hostaway listing ID
        name: review.propertyName,
        address: extractAddressFromName(review.propertyName) ?? null,
        city: extractCityFromName(review.propertyName) ?? "London",
        country: "United Kingdom", // Assuming UK properties for Flex Living
        description: `Beautiful property in ${extractCityFromName(review.propertyName)}`,
      });
    }
  });

  return Array.from(propertiesMap.values());
}

function extractAddressFromName(listingName: string): string {
  // Extract address from listing name format like "2B N1 A - 29 Shoreditch Heights"
  const parts = listingName.split(" - ");
  return parts.length > 1 ? parts[1]! : listingName;
}

function extractCityFromName(listingName: string): string {
  // Extract city from listing name
  const address = extractAddressFromName(listingName);
  const cityRegex = /(Shoreditch|Camden|Notting Hill|Canary Wharf|London)/i;
  const cityMatch = cityRegex.exec(address);
  return cityMatch ? cityMatch[1]! : "London";
}
