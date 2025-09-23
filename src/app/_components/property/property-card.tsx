import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PropertyStats = {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  averageRating: number;
  approvalRate: number;
};

type Property = {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  description: string | null;
  stats: PropertyStats;
};

interface PropertyCardProps {
  property: Property;
  index: number;
  showFeaturedBadge?: boolean;
  className?: string;
}

const mockAmenities = [
  { icon: Wifi, name: "Free WiFi" },
  { icon: Car, name: "Parking" },
  { icon: Coffee, name: "Kitchen" },
];

const mockImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
    </div>
  );
};

export function PropertyCard({
  property,
  index,
  showFeaturedBadge = false,
  className = "",
}: PropertyCardProps) {
  return (
    <Card
      className={`group flex h-full flex-col overflow-hidden border-0 py-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={mockImages[index % mockImages.length] ?? ""}
          width={1000}
          height={1000}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Property Stats Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
            {property.stats.approvedReviews} Reviews
          </Badge>
        </div>

        {/* Featured Badge (conditional) */}
        {showFeaturedBadge && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white">Featured</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 pt-0">
        {/* Property Title & Location */}
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="size-4" />
            <span className="text-sm">
              {property.city}, {property.country}
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>4 Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="size-4" />
            <span>2 Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="size-4" />
            <span>1 Bath</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {mockAmenities.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                <amenity.icon className="h-3 w-3" />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews & Rating */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            {renderStars(property.stats.averageRating)}
            <div className="mt-1 text-xs text-gray-500">
              {property.stats.approvedReviews} approved reviews
            </div>
          </div>

          {property.stats.approvalRate > 0 && (
            <Badge
              variant="outline"
              className="border-green-200 text-green-700"
            >
              {Math.round(property.stats.approvalRate)}% Approved
            </Badge>
          )}
        </div>

        {/* Property Description - Flexible content area */}
        <div className="mb-4 flex-1">
          <p className="line-clamp-2 text-sm text-gray-600">
            {property.description ??
              `Beautiful property located in ${property.city}. Perfect for travelers seeking comfort and convenience in a prime location.`}
          </p>
        </div>

        {/* View Property Button - Sticks to bottom */}
        <div className="mt-auto">
          <Link href={`/property/${property.id}`}>
            <Button className="w-full transition-colors group-hover:bg-blue-600">
              View Property & Reviews
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
