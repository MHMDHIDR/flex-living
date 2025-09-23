import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, Calendar, Star } from "lucide-react";
import { api } from "@/trpc/react";

export type FilterState = {
  rating?: number[];
  channel?: "hostaway" | "google" | "airbnb";
  reviewType?: "host-to-guest" | "guest-to-host";
  status?: "published" | "pending" | "draft";
  isApproved?: boolean;
  propertyId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isLoading: boolean;
}

export function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Get property options for the select
  const { data: propertiesData } = api.properties.getOptions.useQuery();

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] | "all",
  ) => {
    const newFilters = { ...filters };
    if (value === "all" || value === "" || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value as FilterState[typeof key];
    }
    onFiltersChange(newFilters);
  };

  const handleRatingFilter = (rating: number) => {
    const currentRatings = filters.rating ?? [];
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter((r) => r !== rating)
      : [...currentRatings, rating];

    handleFilterChange(
      "rating",
      newRatings.length > 0 ? newRatings : undefined,
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="mr-1 size-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.rating && filters.rating.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Star className="size-3" />
                Rating: {filters.rating.join(", ")} stars
                <button
                  onClick={() => handleFilterChange("rating", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.channel && (
              <Badge variant="outline" className="gap-1">
                Channel: {filters.channel}
                <button
                  onClick={() => handleFilterChange("channel", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.reviewType && (
              <Badge variant="outline" className="gap-1">
                Type: {filters.reviewType.replace("-", " ")}
                <button
                  onClick={() => handleFilterChange("reviewType", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.status && (
              <Badge variant="outline" className="gap-1">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange("status", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.isApproved !== undefined && (
              <Badge variant="outline" className="gap-1">
                {filters.isApproved ? "Approved" : "Not Approved"}
                <button
                  onClick={() => handleFilterChange("isApproved", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {filters.propertyId && (
              <Badge variant="outline" className="gap-1">
                Property:{" "}
                {propertiesData?.find((p) => p.id === filters.propertyId)
                  ?.name ?? "Selected"}
                <button
                  onClick={() => handleFilterChange("propertyId", undefined)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Rating Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rating</Label>
              <div className="flex max-w-48 flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Button
                    key={rating}
                    variant={
                      filters.rating?.includes(rating) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleRatingFilter(rating)}
                    className="size-8 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            {/* Channel Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Channel</Label>
              <Select
                value={filters.channel ?? "all"}
                onValueChange={(
                  value: "all" | "hostaway" | "google" | "airbnb",
                ) => handleFilterChange("channel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All channels</SelectItem>
                  <SelectItem value="hostaway">Hostaway</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Review Type</Label>
              <Select
                value={filters.reviewType ?? "all"}
                onValueChange={(
                  value: "all" | "host-to-guest" | "guest-to-host",
                ) => handleFilterChange("reviewType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="guest-to-host">Guest to Host</SelectItem>
                  <SelectItem value="host-to-guest">Host to Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={filters.status ?? "all"}
                onValueChange={(
                  value: "all" | "published" | "pending" | "draft",
                ) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Property</Label>
              <Select
                value={filters.propertyId ?? "all"}
                onValueChange={(value) =>
                  handleFilterChange("propertyId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All properties</SelectItem>
                  {propertiesData?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Approval Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Approval Status</Label>
              <Select
                value={
                  filters.isApproved === undefined
                    ? "all"
                    : filters.isApproved
                      ? "approved"
                      : "not-approved"
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    handleFilterChange("isApproved", undefined);
                  } else {
                    handleFilterChange("isApproved", value === "approved");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All approvals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All approvals</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="not-approved">Not Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range - Placeholder for future implementation */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <Button
                variant="outline"
                disabled
                className="w-full justify-start"
              >
                <Calendar className="mr-2 size-4" />
                Coming Soon
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
