import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
} from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type PaginationState = {
  page: number;
  limit: number;
  sortBy: "submittedAt" | "rating" | "guestName" | "propertyName";
  sortOrder: "asc" | "desc";
};

type ReviewData = {
  reviews: Array<{
    review: {
      id: string;
      externalId: string;
      propertyId: string;
      guestName: string;
      rating: number | null;
      overallRating: string | null;
      comment: string;
      channel: string;
      reviewType: string;
      status: string;
      isApproved: boolean;
      submittedAt: Date;
    };
    property: {
      id: string;
      name: string;
      city: string | null;
    } | null;
  }>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

interface ReviewsTableProps {
  data?: ReviewData;
  isLoading: boolean;
  pagination: PaginationState;
  onPaginationChange: (pagination: Partial<PaginationState>) => void;
  selectedReviews: string[];
  onSelectionChange: (selected: string[]) => void;
  onRefetch: () => void;
}

export function ReviewsTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
  selectedReviews,
  onSelectionChange,
  onRefetch,
}: ReviewsTableProps) {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Individual approval mutation
  const approvalMutation = api.reviews.updateApproval.useMutation({
    onSuccess: (result) => {
      toast.success(
        `Review ${result.isApproved ? "approved" : "disapproved"} successfully`,
      );
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Failed to update review: ${error.message}`);
    },
  });

  const handleSort = (column: PaginationState["sortBy"]) => {
    const newSortOrder =
      pagination.sortBy === column && pagination.sortOrder === "desc"
        ? "asc"
        : "desc";

    onPaginationChange({
      sortBy: column,
      sortOrder: newSortOrder,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data?.reviews.map((item) => item.review.id) ?? [];
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (reviewId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedReviews, reviewId]);
    } else {
      onSelectionChange(selectedReviews.filter((id) => id !== reviewId));
    }
  };

  const handleApproval = (reviewId: string, isApproved: boolean) => {
    approvalMutation.mutate({ reviewId, isApproved });
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">N/A</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const SortButton = ({
    column,
    children,
  }: {
    column: PaginationState["sortBy"];
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {pagination.sortBy === column ? (
          pagination.sortOrder === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </Button>
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-gray-100"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="py-8 text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Reviews Found
          </h3>
          <p className="text-gray-500">
            No reviews match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      </Card>
    );
  }

  const isAllSelected =
    data.reviews.length > 0 &&
    data.reviews.every((item) => selectedReviews.includes(item.review.id));

  return (
    <Card>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({data.totalCount})
          </h3>

          {/* Per Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) =>
                onPaginationChange({ limit: parseInt(value), page: 1 })
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <SortButton column="guestName">Guest</SortButton>
                </TableHead>
                <TableHead>Property</TableHead>
                <TableHead>
                  <SortButton column="rating">Rating</SortButton>
                </TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <SortButton column="submittedAt">Date</SortButton>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reviews.map((item) => {
                const { review, property } = item;
                const isSelected = selectedReviews.includes(review.id);
                const isExpanded = expandedReview === review.id;

                return (
                  <TableRow
                    key={review.id}
                    className={isSelected ? "bg-blue-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(review.id, checked as boolean)
                        }
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {review.guestName}
                    </TableCell>

                    <TableCell>
                      <div>
                        <div
                          className="max-w-32 truncate font-medium"
                          title={property?.name}
                        >
                          {property?.name ?? "Unknown Property"}
                        </div>
                        {property?.city && (
                          <div className="text-sm text-gray-500">
                            {property.city}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{renderStars(review.rating)}</TableCell>

                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {isExpanded
                            ? review.comment
                            : `${review.comment.slice(0, 100)}${review.comment.length > 100 ? "..." : ""}`}
                        </div>
                        {review.comment.length > 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-blue-600 hover:bg-transparent"
                            onClick={() =>
                              setExpandedReview(isExpanded ? null : review.id)
                            }
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            {isExpanded ? "Show less" : "Read more"}
                          </Button>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          review.channel === "hostaway"
                            ? "border-blue-200 text-blue-700"
                            : review.channel === "google"
                              ? "border-red-200 text-red-700"
                              : "border-pink-200 text-pink-700"
                        }
                      >
                        {review.channel}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {review.reviewType.replace("-", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.submittedAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        {review.isApproved ? (
                          <Badge className="border-green-200 bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-orange-200 text-orange-700"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        {!review.isApproved ? (
                          <Button
                            size="sm"
                            onClick={() => handleApproval(review.id, true)}
                            disabled={approvalMutation.isPending}
                            className="h-8 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(review.id, false)}
                            disabled={approvalMutation.isPending}
                            className="h-8"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, data.totalCount)} of{" "}
            {data.totalCount} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPaginationChange({ page: pagination.page - 1 })}
              disabled={!data.hasPreviousPage}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {data.currentPage} of {data.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPaginationChange({ page: pagination.page + 1 })}
              disabled={!data.hasNextPage}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
