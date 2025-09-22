"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PropertyInfoProps {
  property: {
    id: string;
    name: string;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
  };
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default description if none provided
  const description =
    property.description ??
    `Located in ${property.city ?? "a prime location"}, this apartment is a great choice for anyone looking for comfort and convenience. It's a spacious unit with top-notch amenities to make your stay hassle-free. The area is perfect, with plenty of transport options and local spots to explore. I take pride in keeping the place in...`;

  const shouldShowReadMore = description.length > 200;
  const displayText =
    shouldShowReadMore && !isExpanded
      ? description.slice(0, 200) + "..."
      : description;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">About this property</h2>

      <div className="space-y-4">
        <p className="leading-relaxed text-gray-700">{displayText}</p>

        {shouldShowReadMore && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-0 font-medium text-gray-900 hover:bg-transparent"
          >
            {isExpanded ? "Read less" : "Read more"}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* Property Details */}
      {(property.address ?? property.city) && (
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            {property.address && (
              <div className="flex items-start gap-2">
                <span className="min-w-[80px] text-sm font-medium text-gray-500">
                  Address:
                </span>
                <span className="text-sm text-gray-700">
                  {property.address}
                </span>
              </div>
            )}
            {property.city && (
              <div className="flex items-start gap-2">
                <span className="min-w-[80px] text-sm font-medium text-gray-500">
                  Location:
                </span>
                <span className="text-sm text-gray-700">
                  {property.city}
                  {property.country && `, ${property.country}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
