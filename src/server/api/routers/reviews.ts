import { z } from "zod";
import { eq, and, desc, asc, gte, lte, inArray } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { reviews, reviewCategories, properties } from "@/server/db/schema";
import {
  fetchHostawayReviews,
  normalizeReviewData,
  extractPropertiesFromReviews,
} from "@/lib/hostaway";
import {
  fetchGoogleReviews,
  normalizeGoogleReviewData,
  extractPropertyFromGoogleData,
  getPropertyPlaceIds,
  type NormalizedGoogleReview,
  type NormalizedGoogleProperty,
} from "@/lib/google-places";

// Input validation schemas
const ReviewFiltersSchema = z.object({
  rating: z.array(z.number().min(1).max(10)).optional(),
  channel: z.enum(["hostaway", "google", "airbnb"]).optional(),
  reviewType: z.enum(["host-to-guest", "guest-to-host"]).optional(),
  status: z.enum(["published", "pending", "draft"]).optional(),
  isApproved: z.boolean().optional(),
  propertyId: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

// Utility function to format category names for display
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    cleanliness: "Cleanliness",
    communication: "Communication",
    respect_house_rules: "Respect House Rules",
    location: "Location",
    value: "Value",
    noise_level: "Noise Level",
    overall: "Overall Rating",
  };

  return (
    categoryMap[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z
    .enum(["submittedAt", "rating", "guestName", "propertyName"])
    .default("submittedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const reviewsRouter = createTRPCRouter({
  // Fetch and sync reviews from Hostaway API
  syncFromHostaway: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // Fetch reviews from Hostaway API
      const hostawayData = await fetchHostawayReviews();
      const normalizedReviews = normalizeReviewData(hostawayData);
      const normalizedProperties =
        extractPropertiesFromReviews(normalizedReviews);

      // First, insert or update properties
      for (const property of normalizedProperties) {
        await ctx.db
          .insert(properties)
          .values({
            id: property.id,
            externalId: property.externalId,
            name: property.name,
            address: property.address,
            city: property.city ?? "London",
            country: property.country ?? null,
            description: property.description,
          })
          .onConflictDoUpdate({
            target: properties.externalId,
            set: {
              name: property.name,
              address: property.address,
              city: property.city,
              country: property.country,
              description: property.description,
              updatedAt: new Date(),
            },
          });
      }

      // Then, insert or update reviews
      for (const review of normalizedReviews) {
        // Insert the review
        await ctx.db
          .insert(reviews)
          .values({
            id: review.id,
            externalId: review.externalId,
            propertyId: review.propertyId,
            guestName: review.guestName,
            rating: review.rating,
            overallRating: review.overallRating?.toString(),
            comment: review.comment,
            channel: review.channel,
            reviewType: review.reviewType,
            status: review.status,
            isApproved: review.isApproved,
            submittedAt: review.submittedAt,
          })
          .onConflictDoUpdate({
            target: reviews.externalId,
            set: {
              guestName: review.guestName,
              rating: review.rating,
              overallRating: review.overallRating?.toString(),
              comment: review.comment,
              status: review.status,
              updatedAt: new Date(),
            },
          });

        // Insert review categories
        for (const category of review.categories) {
          await ctx.db
            .insert(reviewCategories)
            .values({
              id: category.id,
              reviewId: review.id,
              category: category.category,
              rating: category.rating,
              normalizedRating: category.normalizedRating.toString(),
            })
            .onConflictDoUpdate({
              target: reviewCategories.id,
              set: {
                rating: category.rating,
                normalizedRating: category.normalizedRating.toString(),
              },
            });
        }
      }

      return {
        success: true,
        reviewsCount: normalizedReviews.length,
        propertiesCount: normalizedProperties.length,
      };
    } catch (error) {
      console.error("Error syncing reviews:", error);
      throw new Error("Failed to sync reviews from Hostaway");
    }
  }),

  // Fetch and sync reviews from Google Places API
  syncFromGoogle: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const placeIdsMap = getPropertyPlaceIds();
      const placeIds = Object.values(placeIdsMap);

      const allNormalizedReviews: NormalizedGoogleReview[] = [];
      const allNormalizedProperties: NormalizedGoogleProperty[] = [];

      // Process each place ID
      for (const placeId of placeIds) {
        const googleData = await fetchGoogleReviews(placeId);
        const normalizedReviews = normalizeGoogleReviewData(googleData);
        const normalizedProperty = extractPropertyFromGoogleData(googleData);

        allNormalizedReviews.push(...normalizedReviews);
        allNormalizedProperties.push(normalizedProperty);
      }

      // First, insert or update properties
      for (const property of allNormalizedProperties) {
        await ctx.db
          .insert(properties)
          .values({
            id: property.id,
            externalId: property.externalId,
            name: property.name,
            address: property.address,
            city: property.city ?? "London",
            country: property.country ?? null,
            description: property.description,
          })
          .onConflictDoUpdate({
            target: properties.externalId,
            set: {
              name: property.name,
              address: property.address,
              city: property.city ?? "London",
              country: property.country,
              description: property.description,
              updatedAt: new Date(),
            },
          });
      }

      // Then, insert or update reviews
      for (const review of allNormalizedReviews) {
        // Insert the review
        await ctx.db
          .insert(reviews)
          .values({
            id: review.id,
            externalId: review.externalId,
            propertyId: review.propertyId,
            guestName: review.guestName,
            rating: review.rating,
            overallRating: review.overallRating?.toString(),
            comment: review.comment,
            channel: review.channel,
            reviewType: review.reviewType,
            status: review.status,
            isApproved: review.isApproved,
            submittedAt: review.submittedAt,
          })
          .onConflictDoUpdate({
            target: reviews.externalId,
            set: {
              guestName: review.guestName,
              rating: review.rating,
              overallRating: review.overallRating?.toString(),
              comment: review.comment,
              status: review.status,
              updatedAt: new Date(),
            },
          });

        // Insert review categories
        for (const category of review.categories) {
          await ctx.db
            .insert(reviewCategories)
            .values({
              id: category.id,
              reviewId: review.id,
              category: category.category,
              rating: category.rating,
              normalizedRating: category.normalizedRating.toString(),
            })
            .onConflictDoUpdate({
              target: reviewCategories.id,
              set: {
                rating: category.rating,
                normalizedRating: category.normalizedRating.toString(),
              },
            });
        }
      }

      return {
        success: true,
        reviewsCount: allNormalizedReviews.length,
        propertiesCount: allNormalizedProperties.length,
      };
    } catch (error) {
      console.error("Error syncing Google reviews:", error);
      throw new Error("Failed to sync reviews from Google Places");
    }
  }),

  // Get all reviews with filtering and pagination
  getAll: publicProcedure
    .input(
      z.object({
        filters: ReviewFiltersSchema.optional(),
        pagination: PaginationSchema.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { filters, pagination } = input;
      const {
        page = 1,
        limit = 20,
        sortBy = "submittedAt",
        sortOrder = "desc",
      } = pagination ?? {};

      // Build where conditions
      const conditions = [];

      if (filters?.rating && filters.rating.length > 0) {
        conditions.push(inArray(reviews.rating, filters.rating));
      }

      if (filters?.channel) {
        conditions.push(eq(reviews.channel, filters.channel));
      }

      if (filters?.reviewType) {
        conditions.push(eq(reviews.reviewType, filters.reviewType));
      }

      if (filters?.status) {
        conditions.push(eq(reviews.status, filters.status));
      }

      if (filters?.isApproved !== undefined) {
        conditions.push(eq(reviews.isApproved, filters.isApproved));
      }

      if (filters?.propertyId) {
        conditions.push(eq(reviews.propertyId, filters.propertyId));
      }

      if (filters?.dateRange?.from) {
        conditions.push(gte(reviews.submittedAt, filters.dateRange.from));
      }

      if (filters?.dateRange?.to) {
        conditions.push(lte(reviews.submittedAt, filters.dateRange.to));
      }

      // Build order by - map sort fields to actual columns
      let orderByColumn;
      switch (sortBy) {
        case "submittedAt":
          orderByColumn = reviews.submittedAt;
          break;
        case "rating":
          orderByColumn = reviews.rating;
          break;
        case "guestName":
          orderByColumn = reviews.guestName;
          break;
        case "propertyName":
          // For propertyName, we'll sort by the joined property name - we need to adjust the query
          orderByColumn = reviews.submittedAt; // fallback to submittedAt for now
          break;
        default:
          orderByColumn = reviews.submittedAt;
      }
      const orderBy =
        sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

      // Execute query with pagination
      const offset = (page - 1) * limit;

      const reviewsData = await ctx.db
        .select({
          review: reviews,
          property: properties,
        })
        .from(reviews)
        .leftJoin(properties, eq(reviews.propertyId, properties.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: reviews.id })
        .from(reviews)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        reviews: reviewsData,
        totalCount: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalCount.length / limit),
        hasPreviousPage: page > 1,
      };
    }),

  // Get reviews for a specific property (for public display)
  getByProperty: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        onlyApproved: z.boolean().default(true),
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { propertyId, onlyApproved, limit, page } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(reviews.propertyId, propertyId)];

      if (onlyApproved) {
        conditions.push(eq(reviews.isApproved, true));
      }

      const reviewsData = await ctx.db
        .select({
          review: reviews,
          property: properties,
        })
        .from(reviews)
        .leftJoin(properties, eq(reviews.propertyId, properties.id))
        .where(and(...conditions))
        .orderBy(desc(reviews.submittedAt))
        .limit(limit)
        .offset(offset);

      return {
        reviews: reviewsData,
        propertyId,
      };
    }),

  // Get review with categories
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const reviewData = await ctx.db
        .select({
          review: reviews,
          property: properties,
        })
        .from(reviews)
        .leftJoin(properties, eq(reviews.propertyId, properties.id))
        .where(eq(reviews.id, input.id))
        .limit(1);

      if (reviewData.length === 0) {
        throw new Error("Review not found");
      }

      const categories = await ctx.db
        .select()
        .from(reviewCategories)
        .where(eq(reviewCategories.reviewId, input.id));

      return {
        ...reviewData[0],
        categories,
      };
    }),

  // Approve or disapprove a review
  updateApproval: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
        isApproved: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { reviewId, isApproved } = input;

      await ctx.db
        .update(reviews)
        .set({
          isApproved,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, reviewId));

      return { success: true, reviewId, isApproved };
    }),

  // Bulk update approval status
  bulkUpdateApproval: publicProcedure
    .input(
      z.object({
        reviewIds: z.array(z.string()),
        isApproved: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { reviewIds, isApproved } = input;

      await ctx.db
        .update(reviews)
        .set({
          isApproved,
          updatedAt: new Date(),
        })
        .where(inArray(reviews.id, reviewIds));

      return { success: true, updatedCount: reviewIds.length, isApproved };
    }),

  // Get performance metrics
  getMetrics: publicProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { propertyId, dateRange } = input;

      const conditions = [];

      if (propertyId) {
        conditions.push(eq(reviews.propertyId, propertyId));
      }

      if (dateRange?.from) {
        conditions.push(gte(reviews.submittedAt, dateRange.from));
      }

      if (dateRange?.to) {
        conditions.push(lte(reviews.submittedAt, dateRange.to));
      }

      const reviewsData = await ctx.db
        .select()
        .from(reviews)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Calculate metrics
      const totalReviews = reviewsData.length;
      const approvedReviews = reviewsData.filter((r) => r.isApproved).length;
      const ratings = reviewsData
        .filter((r) => r.rating !== null)
        .map((r) => r.rating!);

      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

      const channelDistribution = reviewsData.reduce(
        (acc, review) => {
          acc[review.channel] = (acc[review.channel] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalReviews,
        approvedReviews,
        approvalRate:
          totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0,
        averageRating: Math.round(averageRating * 100) / 100,
        channelDistribution,
      };
    }),

  // Get trend analysis for identifying top issues
  getTrendAnalysis: publicProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
        limit: z.number().min(1).max(10).default(5),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { propertyId, dateRange, limit } = input;

      // Build conditions for filtering reviews
      const reviewConditions = [];

      if (propertyId) {
        reviewConditions.push(eq(reviews.propertyId, propertyId));
      }

      if (dateRange?.from) {
        reviewConditions.push(gte(reviews.submittedAt, dateRange.from));
      }

      if (dateRange?.to) {
        reviewConditions.push(lte(reviews.submittedAt, dateRange.to));
      }

      // Only analyze guest-to-host reviews as they contain feedback about issues
      reviewConditions.push(eq(reviews.reviewType, "guest-to-host"));
      reviewConditions.push(eq(reviews.isApproved, true)); // Only approved reviews

      // Get all review categories with their ratings
      const categoriesData = await ctx.db
        .select({
          category: reviewCategories.category,
          rating: reviewCategories.rating,
          normalizedRating: reviewCategories.normalizedRating,
          reviewId: reviewCategories.reviewId,
        })
        .from(reviewCategories)
        .innerJoin(reviews, eq(reviewCategories.reviewId, reviews.id))
        .where(
          reviewConditions.length > 0 ? and(...reviewConditions) : undefined,
        );

      // Group by category and calculate issue metrics
      const categoryAnalysis = categoriesData.reduce(
        (acc, item) => {
          const category = item.category;
          const rating = item.rating; // 1-10 scale
          acc[category] ??= {
            category,
            totalReviews: 0,
            totalRating: 0,
            lowRatingCount: 0, // ratings <= 7 (3.5 normalized) are considered issues
            ratings: [],
          };

          acc[category].totalReviews++;
          acc[category].totalRating += rating;
          acc[category].ratings.push(rating);

          // Count low ratings as potential issues (≤7 on 1-10 scale = ≤3.5 on 1-5 scale)
          if (rating <= 7) {
            acc[category].lowRatingCount++;
          }

          return acc;
        },
        {} as Record<
          string,
          {
            category: string;
            totalReviews: number;
            totalRating: number;
            lowRatingCount: number;
            ratings: number[];
          }
        >,
      );

      // Calculate final metrics and sort by issue priority
      const topIssues = Object.values(categoryAnalysis)
        .map((data) => {
          const averageRating = data.totalRating / data.totalReviews;
          const normalizedAverage = averageRating / 2; // Convert to 1-5 scale
          const issuePercentage =
            (data.lowRatingCount / data.totalReviews) * 100;

          // Priority score: weight low ratings more heavily if they're frequent
          const priorityScore = data.lowRatingCount * (1 / normalizedAverage);

          return {
            category: data.category,
            displayName: formatCategoryName(data.category),
            negativeReviews: data.lowRatingCount,
            totalReviews: data.totalReviews,
            averageRating: Math.round(normalizedAverage * 10) / 10,
            issuePercentage: Math.round(issuePercentage),
            priorityScore,
          };
        })
        .filter((issue) => issue.negativeReviews > 0) // Only show categories with issues
        .sort((a, b) => b.priorityScore - a.priorityScore) // Sort by priority
        .slice(0, limit);

      return {
        topIssues,
        totalCategoriesAnalyzed: Object.keys(categoryAnalysis).length,
        totalReviewsAnalyzed: categoriesData.length,
      };
    }),

  // Get category averages across all reviews
  getCategoryAverages: publicProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { propertyId, dateRange } = input;

      // Build conditions for filtering reviews
      const reviewConditions = [];

      if (propertyId) {
        reviewConditions.push(eq(reviews.propertyId, propertyId));
      }

      if (dateRange?.from) {
        reviewConditions.push(gte(reviews.submittedAt, dateRange.from));
      }

      if (dateRange?.to) {
        reviewConditions.push(lte(reviews.submittedAt, dateRange.to));
      }

      // Only analyze guest-to-host reviews that are approved
      reviewConditions.push(eq(reviews.reviewType, "guest-to-host"));
      reviewConditions.push(eq(reviews.isApproved, true));

      // Get all review categories with their ratings
      const categoriesData = await ctx.db
        .select({
          category: reviewCategories.category,
          rating: reviewCategories.rating,
          normalizedRating: reviewCategories.normalizedRating,
        })
        .from(reviewCategories)
        .innerJoin(reviews, eq(reviewCategories.reviewId, reviews.id))
        .where(
          reviewConditions.length > 0 ? and(...reviewConditions) : undefined,
        );

      // Group by category and calculate averages
      const categoryAverages = categoriesData.reduce(
        (acc, item) => {
          const category = item.category;
          const rating = item.rating; // 1-10 scale

          acc[category] ??= {
            category,
            totalRating: 0,
            count: 0,
            ratings: [],
          };

          acc[category].totalRating += rating;
          acc[category].count++;
          acc[category].ratings.push(rating);

          return acc;
        },
        {} as Record<
          string,
          {
            category: string;
            totalRating: number;
            count: number;
            ratings: number[];
          }
        >,
      );

      // Calculate final averages and format for display
      const averages = Object.values(categoryAverages)
        .map((data) => {
          const averageRating = data.totalRating / data.count;
          return {
            category: data.category,
            displayName: formatCategoryName(data.category),
            averageRating: Math.round(averageRating * 10) / 10, // Keep on 1-10 scale
            normalizedAverage: Math.round((averageRating / 2) * 10) / 10, // Convert to 1-5 scale
            reviewCount: data.count,
          };
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName)); // Sort alphabetically

      return {
        categoryAverages: averages,
        totalReviewsAnalyzed: categoriesData.length,
        categoriesFound: averages.length,
      };
    }),
});
