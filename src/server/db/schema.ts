import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `flex-living_${name}`);

// User role enum type
export const userRoleEnum = ["USER", "ADMIN"] as const;
export type UserRoleType = (typeof userRoleEnum)[number];

// Authentication tables (existing)
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: d
    .varchar({ length: 50 })
    .$type<UserRoleType>()
    .notNull()
    .default("USER"),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Properties table
export const properties = createTable(
  "property",
  (d) => ({
    id: d.varchar({ length: 255 }).notNull().primaryKey(),
    externalId: d.varchar({ length: 255 }).notNull(), // Hostaway listing ID
    name: d.varchar({ length: 500 }).notNull(),
    address: d.varchar({ length: 500 }),
    city: d.varchar({ length: 255 }),
    country: d.varchar({ length: 255 }),
    description: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("property_external_id_idx").on(t.externalId),
    index("property_name_idx").on(t.name),
  ],
);

// Reviews table
export const reviews = createTable(
  "review",
  (d) => ({
    id: d.varchar({ length: 255 }).notNull().primaryKey(),
    externalId: d.varchar({ length: 255 }).notNull(), // Hostaway review ID
    propertyId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => properties.id),
    guestName: d.varchar({ length: 255 }).notNull(),
    rating: d.integer(), // Overall rating (nullable for host-to-guest reviews)
    overallRating: d.numeric({ precision: 3, scale: 2 }), // Calculated from categories
    comment: d.text().notNull(),
    channel: d.varchar({ length: 50 }).notNull(), // hostaway, google, airbnb
    reviewType: d.varchar({ length: 20 }).notNull(), // host-to-guest, guest-to-host
    status: d.varchar({ length: 20 }).notNull(), // published, pending, draft
    isApproved: d.boolean().notNull().default(false),
    submittedAt: d.timestamp({ withTimezone: true }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("review_property_id_idx").on(t.propertyId),
    index("review_channel_idx").on(t.channel),
    index("review_status_idx").on(t.status),
    index("review_is_approved_idx").on(t.isApproved),
    index("review_submitted_at_idx").on(t.submittedAt),
    index("review_external_id_idx").on(t.externalId),
  ],
);

// Review categories table for detailed ratings
export const reviewCategories = createTable(
  "review_category",
  (d) => ({
    id: d.varchar({ length: 255 }).notNull().primaryKey(),
    reviewId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    category: d.varchar({ length: 50 }).notNull(), // cleanliness, communication, etc.
    rating: d.integer().notNull(), // 1-10 scale from Hostaway
    normalizedRating: d.numeric({ precision: 3, scale: 2 }), // 1-5 scale for display
  }),
  (t) => [
    index("review_category_review_id_idx").on(t.reviewId),
    index("review_category_category_idx").on(t.category),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
  categories: many(reviewCategories),
}));

export const reviewCategoriesRelations = relations(
  reviewCategories,
  ({ one }) => ({
    review: one(reviews, {
      fields: [reviewCategories.reviewId],
      references: [reviews.id],
    }),
  }),
);

// Legacy posts table (to be removed)
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);
