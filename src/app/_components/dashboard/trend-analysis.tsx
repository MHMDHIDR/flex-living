import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Star } from "lucide-react";
import { api } from "@/trpc/react";

interface TrendAnalysisProps {
  propertyId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export function TrendAnalysis({ propertyId, dateRange }: TrendAnalysisProps) {
  const { data: trendData, isLoading } = api.reviews.getTrendAnalysis.useQuery({
    propertyId,
    dateRange,
    limit: 5,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-6 w-48 rounded bg-gray-200"></div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-3 w-32 rounded bg-gray-100"></div>
                </div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!trendData?.topIssues || trendData.topIssues.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Top Issues to Address
          </h3>
        </div>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Star className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900">
            No Issues Found
          </h4>
          <p className="text-gray-600">
            Great job! All review categories are performing well with high
            ratings.
          </p>
        </div>
      </Card>
    );
  }

  const getIssueColor = (averageRating: number) => {
    if (averageRating <= 2.0) return "text-red-600 bg-red-50 border-red-200";
    if (averageRating <= 3.0)
      return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getIssueIcon = (averageRating: number) => {
    if (averageRating <= 2.0) return "🔴";
    if (averageRating <= 3.0) return "🟠";
    return "🟡";
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Top Issues to Address
          </h3>
        </div>
        {trendData.totalReviewsAnalyzed > 0 && (
          <Badge variant="outline" className="text-xs">
            Based on {trendData.totalReviewsAnalyzed} reviews
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {trendData.topIssues.map((issue, index) => (
          <div
            key={issue.category}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {/* Issue Rank */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                {index + 1}
              </div>

              {/* Issue Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {getIssueIcon(issue.averageRating)}
                  </span>
                  <h4 className="font-medium text-gray-900">
                    {issue.displayName}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    {issue.negativeReviews} negative review
                    {issue.negativeReviews !== 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span>Avg: {issue.averageRating.toFixed(1)}/5.0</span>
                </div>
              </div>
            </div>

            {/* Issue Severity Badge */}
            <div className="text-right">
              <Badge
                variant="outline"
                className={`${getIssueColor(issue.averageRating)} border`}
              >
                {issue.issuePercentage}% issues
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {trendData.topIssues.length > 0 && (
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xs">💡</span>
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-medium text-blue-900">
                Improvement Suggestions
              </h5>
              <p className="text-xs text-blue-700">
                Focus on the top-ranked issues first. Consider reaching out to
                guests with low ratings in these categories to understand
                specific concerns and implement targeted improvements.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
