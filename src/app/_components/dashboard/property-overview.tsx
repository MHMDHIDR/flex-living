import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

type PropertyWithStats = {
  id: string;
  name: string;
  city?: string;
  stats: {
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    averageRating: number;
    approvalRate: number;
  };
};

interface PropertyOverviewProps {
  data?: PropertyWithStats[];
  isLoading: boolean;
  onPropertySelect: (propertyId: string) => void;
}

export function PropertyOverview({
  data,
  isLoading,
  onPropertySelect,
}: PropertyOverviewProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-3 h-3 w-1/2 rounded bg-gray-200"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded bg-gray-200"></div>
                  <div className="h-6 w-16 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="py-8 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Properties Found
          </h3>
          <p className="mb-4 text-gray-500">
            Sync reviews from Hostaway to see property performance data.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Property Performance Overview
          </h3>
          <Badge variant="secondary">{data.length} properties</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((property) => (
            <div
              key={property.id}
              className="group cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
              onClick={() => onPropertySelect(property.id)}
            >
              <div className="space-y-3">
                {/* Property Info */}
                <div>
                  <h4 className="line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    {property.name}
                  </h4>
                  {property.city && (
                    <p className="text-sm text-gray-500">{property.city}</p>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">
                      {property.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">avg</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {property.stats.totalReviews}
                    </span>
                    <span className="text-gray-500">reviews</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">
                      {property.stats.approvedReviews}
                    </span>
                    <span className="text-gray-500">approved</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">
                      {property.stats.pendingReviews}
                    </span>
                    <span className="text-gray-500">pending</span>
                  </div>
                </div>

                {/* Approval Rate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-medium">
                      {property.stats.approvalRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        property.stats.approvalRate >= 80
                          ? "bg-green-500"
                          : property.stats.approvalRate >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${property.stats.approvalRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full group-hover:border-blue-200 group-hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertySelect(property.id);
                  }}
                >
                  View Reviews
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, p) => sum + p.stats.totalReviews, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {data.reduce((sum, p) => sum + p.stats.approvedReviews, 0)}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {data.reduce((sum, p) => sum + p.stats.pendingReviews, 0)}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {(
                  data.reduce((sum, p) => sum + p.stats.averageRating, 0) /
                  data.length
                ).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
