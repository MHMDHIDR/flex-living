"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

type MetricsData = {
  totalReviews: number;
  approvedReviews: number;
  approvalRate: number;
  averageRating: number;
  channelDistribution: Record<string, number>;
};

interface PerformanceMetricsProps {
  data?: MetricsData;
  isLoading: boolean;
}

export function PerformanceMetrics({
  data,
  isLoading,
}: PerformanceMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="mb-2 h-8 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/3 rounded bg-gray-200"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Reviews",
      value: data?.totalReviews ?? 0,
      subtitle: "All time",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average Rating",
      value: data?.averageRating?.toFixed(1) ?? "0.0",
      subtitle: "Out of 5 stars",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Approved Reviews",
      value: data?.approvedReviews ?? 0,
      subtitle: `${data?.approvalRate?.toFixed(1) ?? 0}% approval rate`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Reviews",
      value: (data?.totalReviews ?? 0) - (data?.approvedReviews ?? 0),
      subtitle: "Awaiting approval",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500">{metric.subtitle}</p>
                </div>
                <div className={`rounded-full p-3 ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Channel Distribution */}
      {data?.channelDistribution && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Reviews by Channel
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(data.channelDistribution).map(
              ([channel, count]) => {
                const percentage =
                  data.totalReviews > 0
                    ? ((count / data.totalReviews) * 100).toFixed(1)
                    : 0;

                const channelColors = {
                  hostaway: "bg-blue-500",
                  google: "bg-red-500",
                  airbnb: "bg-pink-500",
                };

                const bgColor =
                  channelColors[channel as keyof typeof channelColors] ||
                  "bg-gray-500";

                return (
                  <div key={channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${bgColor}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {channel}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count} ({percentage}%)
                      </Badge>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${bgColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
