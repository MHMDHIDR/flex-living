CREATE TABLE "flex-living_property" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"externalId" varchar(255) NOT NULL,
	"name" varchar(500) NOT NULL,
	"address" varchar(500),
	"city" varchar(255),
	"country" varchar(255),
	"description" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "flex-living_review_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"reviewId" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"rating" integer NOT NULL,
	"normalizedRating" numeric(3, 2)
);
--> statement-breakpoint
CREATE TABLE "flex-living_review" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"externalId" varchar(255) NOT NULL,
	"propertyId" varchar(255) NOT NULL,
	"guestName" varchar(255) NOT NULL,
	"rating" integer,
	"overallRating" numeric(3, 2),
	"comment" text NOT NULL,
	"channel" varchar(50) NOT NULL,
	"reviewType" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"isApproved" boolean DEFAULT false NOT NULL,
	"submittedAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DROP INDEX "t_user_id_idx";--> statement-breakpoint
ALTER TABLE "flex-living_review_category" ADD CONSTRAINT "flex-living_review_category_reviewId_flex-living_review_id_fk" FOREIGN KEY ("reviewId") REFERENCES "public"."flex-living_review"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flex-living_review" ADD CONSTRAINT "flex-living_review_propertyId_flex-living_property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."flex-living_property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "property_external_id_idx" ON "flex-living_property" USING btree ("externalId");--> statement-breakpoint
CREATE INDEX "property_name_idx" ON "flex-living_property" USING btree ("name");--> statement-breakpoint
CREATE INDEX "review_category_review_id_idx" ON "flex-living_review_category" USING btree ("reviewId");--> statement-breakpoint
CREATE INDEX "review_category_category_idx" ON "flex-living_review_category" USING btree ("category");--> statement-breakpoint
CREATE INDEX "review_property_id_idx" ON "flex-living_review" USING btree ("propertyId");--> statement-breakpoint
CREATE INDEX "review_channel_idx" ON "flex-living_review" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "review_status_idx" ON "flex-living_review" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_is_approved_idx" ON "flex-living_review" USING btree ("isApproved");--> statement-breakpoint
CREATE INDEX "review_submitted_at_idx" ON "flex-living_review" USING btree ("submittedAt");--> statement-breakpoint
CREATE INDEX "review_external_id_idx" ON "flex-living_review" USING btree ("externalId");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "flex-living_session" USING btree ("userId");