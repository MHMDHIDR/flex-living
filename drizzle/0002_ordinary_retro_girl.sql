ALTER TABLE "flex-living_property" ADD CONSTRAINT "property_external_id_unique" UNIQUE("externalId");--> statement-breakpoint
ALTER TABLE "flex-living_review_category" ADD CONSTRAINT "review_category_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "flex-living_review" ADD CONSTRAINT "review_external_id_unique" UNIQUE("externalId");