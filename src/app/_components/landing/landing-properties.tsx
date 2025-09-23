import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { api } from "@/trpc/server";
import Link from "next/link";
import { PropertyCard } from "@/app/_components/property/property-card";

export default async function LandingProperties() {
  // Get featured properties (first 3 properties)
  const allProperties = await api.properties.getWithStats();
  const featuredProperties = allProperties.slice(0, 3);

  return (
    featuredProperties.length > 0 && (
      <section className="bg-gray-50 py-16" id="featured-properties">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="mb-4 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Featured Properties
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
                Discover our premium accommodations with verified guest reviews
                and professional management
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  showFeaturedBadge={true}
                />
              ))}
            </div>

            {/* View All Properties Button */}
            <div className="mt-12 text-center">
              <Link href="/property">
                <Button size="lg" variant="outline" className="group">
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  );
}
