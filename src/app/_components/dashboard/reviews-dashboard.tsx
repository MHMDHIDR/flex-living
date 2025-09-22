"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, CheckCircle, Clock, Star } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

import { PerformanceMetrics } from "@/app/_components/dashboard/performance-metrics";
import { FilterControls } from "@/app/_components/dashboard/filter-controls";
import { ReviewsTable } from "@/app/_components/dashboard/reviews-table";
import { PropertyOverview } from "@/app/_components/dashboard/property-overview";

type FilterState = {
  rating?: number[];
  channel?: string;
  reviewType?: string;
  status?: string;
  isApproved?: boolean;
  propertyId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

type PaginationState = {
  page: number;
  limit: number;
  sortBy: "submittedAt" | "rating" | "guestName" | "propertyName";
  sortOrder: "asc" | "desc";
};

export function ReviewsDashboard() {
  const [filters, setFilters] = useState<FilterState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    sortBy: "submittedAt",
    sortOrder: "desc",
  });
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  // tRPC queries
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = api.reviews.getAll.useQuery({
    filters,
    pagination,
  });

  const { data: metricsData, isLoading: metricsLoading } =
    api.reviews.getMetrics.useQuery({
      propertyId: filters.propertyId,
      dateRange: filters.dateRange,
    });

  const { data: propertiesData, isLoading: propertiesLoading } =
    api.properties.getWithStats.useQuery();

  // tRPC mutations
  const syncMutation = api.reviews.syncFromHostaway.useMutation({
    onSuccess: (data) => {
      toast.success(
        `Successfully synced ${data.reviewsCount} reviews from ${data.propertiesCount} properties`,
      );
      refetchReviews();
    },
    onError: (error) => {
      toast.error(`Failed to sync reviews: ${error.message}`);
    },
  });

  const bulkApprovalMutation = api.reviews.bulkUpdateApproval.useMutation({
    onSuccess: (data) => {
      toast.success(
        `${data.isApproved ? "Approved" : "Disapproved"} ${data.updatedCount} reviews`,
      );
      setSelectedReviews([]);
      refetchReviews();
    },
    onError: (error) => {
      toast.error(`Failed to update reviews: ${error.message}`);
    },
  });

  const handleSync = () => {
    syncMutation.mutate();
  };

  const handleBulkApproval = (isApproved: boolean) => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to update");
      return;
    }

    bulkApprovalMutation.mutate({
      reviewIds: selectedReviews,
      isApproved,
    });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon");
  };

  const isLoading = reviewsLoading || metricsLoading || propertiesLoading;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`}
            />
            Sync Reviews
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!reviewsData?.reviews?.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>
              {metricsData?.averageRating?.toFixed(1) || "0.0"} avg rating
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{metricsData?.approvedReviews || 0} approved</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>
              {(metricsData?.totalReviews || 0) -
                (metricsData?.approvedReviews || 0)}{" "}
              pending
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics data={metricsData} isLoading={metricsLoading} />

      {/* Property Overview */}
      <PropertyOverview
        data={propertiesData}
        isLoading={propertiesLoading}
        onPropertySelect={(propertyId) =>
          handleFilterChange({ ...filters, propertyId })
        }
      />

      {/* Filter Controls */}
      <FilterControls
        filters={filters}
        onFiltersChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedReviews.length} selected
              </Badge>
              <span className="text-sm text-gray-600">
                Bulk actions available
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleBulkApproval(true)}
                disabled={bulkApprovalMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Approve All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkApproval(false)}
                disabled={bulkApprovalMutation.isPending}
              >
                <Clock className="mr-1 h-4 w-4" />
                Disapprove All
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedReviews([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews Table */}
      <ReviewsTable
        data={reviewsData}
        isLoading={reviewsLoading}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        selectedReviews={selectedReviews}
        onSelectionChange={setSelectedReviews}
        onRefetch={refetchReviews}
      />
    </div>
  );
}
