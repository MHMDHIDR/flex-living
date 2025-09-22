import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface PropertyLocationProps {
  property: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
  };
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  const displayLocation = property.city
    ? `${property.city}${property.country ? `, ${property.country}` : ""}`
    : "Location not specified";

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Location</h2>

      <div className="space-y-6">
        {/* Location Summary */}
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">{displayLocation}</h3>
            {property.address && (
              <p className="text-sm text-gray-600">{property.address}</p>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="overflow-hidden p-0">
          <div className="relative">
            {/* Map placeholder - in production, integrate with Google Maps or similar */}
            <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 md:h-80">
              <div className="space-y-3 text-center">
                <MapPin className="mx-auto h-12 w-12 text-green-600" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-green-800">
                    {property.name}
                  </h4>
                  <p className="text-green-700">{displayLocation}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Maps
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <Navigation className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Getting Around</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Public Transport:</span>
                <span className="font-medium">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span>Walking Score:</span>
                <span className="font-medium">Very Walkable</span>
              </div>
              <div className="flex justify-between">
                <span>Bike Score:</span>
                <span className="font-medium">Bikeable</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Nearby</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Restaurants:</span>
                <span className="font-medium">50+ within 1km</span>
              </div>
              <div className="flex justify-between">
                <span>Supermarkets:</span>
                <span className="font-medium">3 within 500m</span>
              </div>
              <div className="flex justify-between">
                <span>Tube Station:</span>
                <span className="font-medium">5 min walk</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Transportation Links */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Google Maps
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
