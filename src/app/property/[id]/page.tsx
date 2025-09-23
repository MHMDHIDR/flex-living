import { api } from "@/trpc/server";
import { PropertyGallery } from "@/app/_components/property/property-gallery";
import { PropertyInfo } from "@/app/_components/property/property-info";
import { PropertyBooking } from "@/app/_components/property/property-booking";
import { PropertyAmenities } from "@/app/_components/property/property-amenities";
import { PropertyPolicies } from "@/app/_components/property/property-policies";
import { PropertyLocation } from "@/app/_components/property/property-location";
import { PropertyReviews } from "@/app/_components/property/property-reviews";
import { notFound } from "next/navigation";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  // Get property details
  let property;
  try {
    property = await api.properties.getById({ id });
  } catch {
    notFound();
  }

  if (!property.property) {
    notFound();
  }

  // Get approved reviews for this property
  const reviews = await api.reviews.getByProperty({
    propertyId: id,
    onlyApproved: true,
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Property Content */}
      <div className="container mx-auto px-4 py-6 pt-20">
        <div className="mx-auto max-w-7xl">
          {/* Photo Gallery */}
          <PropertyGallery property={property.property} />

          {/* Property Title and Basic Info */}
          <div className="mt-6 mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {property.property.name}
            </h1>

            <div className="flex items-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>4 Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
                </svg>
                <span>1 Bedroom</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM6 3a2 2 0 00-2 2v1h12V5a2 2 0 00-2-2H6zM4 7v8a2 2 0 002 2h8a2 2 0 002-2V7H4z" />
                </svg>
                <span>1 Bathroom</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>3 Beds</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Property Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* About This Property */}
              <PropertyInfo property={property.property} />

              {/* Amenities */}
              <PropertyAmenities />

              {/* Stay Policies */}
              <PropertyPolicies />

              {/* Location */}
              <PropertyLocation property={property.property} />

              {/* Reviews Section - Only show approved reviews */}
              <PropertyReviews
                reviews={reviews.reviews}
                propertyId={id}
                totalCount={reviews.reviews.length}
              />
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PropertyBooking property={property.property} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
