import { z } from "zod";
import { eq, desc, count } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { properties, reviews } from "@/server/db/schema";

export const propertiesRouter = createTRPCRouter({
  // Get all properties with basic metrics
  getAll: publicProcedure.query(async ({ ctx }) => {
    const propertiesData = await ctx.db
      .select({
        property: properties,
        reviewCount: count(reviews.id),
      })
      .from(properties)
      .leftJoin(reviews, eq(properties.id, reviews.propertyId))
      .groupBy(properties.id)
      .orderBy(desc(properties.createdAt));

    return propertiesData;
  }),

  // Get a single property by ID with detailed metrics
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const propertyData = await ctx.db
        .select()
        .from(properties)
        .where(eq(properties.id, input.id))
        .limit(1);

      if (propertyData.length === 0) {
        throw new Error("Property not found");
      }

      // Get review metrics for this property
      const reviewsData = await ctx.db
        .select()
        .from(reviews)
        .where(eq(reviews.propertyId, input.id));

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
        property: propertyData[0],
        metrics: {
          totalReviews,
          approvedReviews,
          averageRating: Math.round(averageRating * 100) / 100,
          approvalRate:
            totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0,
          channelDistribution,
        },
      };
    }),

  // Get properties with review statistics (for dashboard overview)
  getWithStats: publicProcedure.query(async ({ ctx }) => {
    const propertiesData = await ctx.db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));

    const propertiesWithStats = await Promise.all(
      propertiesData.map(async (property) => {
        const reviewsData = await ctx.db
          .select()
          .from(reviews)
          .where(eq(reviews.propertyId, property.id));

        const totalReviews = reviewsData.length;
        const approvedReviews = reviewsData.filter((r) => r.isApproved).length;
        const pendingReviews = reviewsData.filter((r) => !r.isApproved).length;
        const ratings = reviewsData
          .filter((r) => r.rating !== null)
          .map((r) => r.rating!);

        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;

        return {
          ...property,
          stats: {
            totalReviews,
            approvedReviews,
            pendingReviews,
            averageRating: Math.round(averageRating * 100) / 100,
            approvalRate:
              totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0,
          },
        };
      }),
    );

    return propertiesWithStats;
  }),

  // Get property options for filters/selectors
  getOptions: publicProcedure.query(async ({ ctx }) => {
    const propertiesData = await ctx.db
      .select({
        id: properties.id,
        name: properties.name,
        city: properties.city,
      })
      .from(properties)
      .orderBy(properties.name);

    return propertiesData;
  }),
});
