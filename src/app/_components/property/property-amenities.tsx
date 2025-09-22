import { Button } from "@/components/ui/button";
import {
  Tv,
  Wifi,
  ChefHat,
  Zap,
  Shield,
  Car,
  Wind,
  ChevronRight,
} from "lucide-react";

export function PropertyAmenities() {
  // Standard amenities based on the Flex Living images
  const amenities = [
    {
      id: "cable-tv",
      name: "Cable TV",
      icon: Tv,
      category: "entertainment",
    },
    {
      id: "internet",
      name: "Internet",
      icon: Wifi,
      category: "connectivity",
    },
    {
      id: "wireless",
      name: "Wireless",
      icon: Wifi,
      category: "connectivity",
    },
    {
      id: "kitchen",
      name: "Kitchen",
      icon: ChefHat,
      category: "cooking",
    },
    {
      id: "washing-machine",
      name: "Washing Machine",
      icon: Zap,
      category: "laundry",
    },
    {
      id: "hair-dryer",
      name: "Hair Dryer",
      icon: Wind,
      category: "bathroom",
    },
    {
      id: "heating",
      name: "Heating",
      icon: Zap,
      category: "climate",
    },
    {
      id: "smoke-detector",
      name: "Smoke Detector",
      icon: Shield,
      category: "safety",
    },
    {
      id: "carbon-monoxide-detector",
      name: "Carbon Monoxide Detector",
      icon: Shield,
      category: "safety",
    },
  ];

  const displayedAmenities = amenities.slice(0, 6);
  const hasMoreAmenities = amenities.length > 6;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
        {hasMoreAmenities && (
          <Button variant="ghost" className="font-medium text-gray-900">
            View all amenities
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {displayedAmenities.map((amenity) => {
          const Icon = amenity.icon;
          return (
            <div key={amenity.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">{amenity.name}</span>
            </div>
          );
        })}
      </div>

      {hasMoreAmenities && (
        <div className="pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Show all {amenities.length} amenities
          </Button>
        </div>
      )}
    </section>
  );
}
