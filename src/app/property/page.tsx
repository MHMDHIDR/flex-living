import { api } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { PropertyCard } from "@/app/_components/property/property-card";

export default async function PropertiesPage() {
  // Get all properties with review statistics
  const properties = await api.properties.getWithStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Discover Premium Properties
            </h1>
            <p className="text-xl text-gray-600">
              {`Carefully curated accommodations in London's most desirable
              locations. Each property is professionally managed with verified
              guest reviews.`}
            </p>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {properties.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Properties Available
              </h3>
              <p className="text-gray-600">
                {`Properties will appear here once they're synced from Hostaway.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  showFeaturedBadge={false}
                />
              ))}
            </div>
          )}

          {/* Call to Action */}
          {properties.length > 0 && (
            <div className="mt-16 rounded-2xl bg-gradient-to-r from-green-300 via-green-600 to-green-800 px-8 py-12 text-center text-white">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Experience Premium Living?
              </h2>
              <p className="mb-6 text-xl text-green-100">
                Each property is carefully vetted with verified guest reviews
                and professional management.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg">
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-green-600"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
