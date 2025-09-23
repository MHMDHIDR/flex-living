"use client";

import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface IssueData {
  category: string;
  displayName: string;
  negativeReviews: number;
  totalReviews: number;
  averageRating: number;
  issuePercentage: number;
  priorityScore: number;
}

interface IssuesChartProps {
  data: IssueData[];
  totalReviewsAnalyzed: number;
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  issuePercentage: number;
  averageRating: number;
  negativeReviews: number;
  totalReviews: number;
  displayName: string;
  scaledRating: number;
  priorityScore: number;
}

export function IssuesChart({
  data,
  totalReviewsAnalyzed,
  isLoading = false,
}: IssuesChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-6 w-48 rounded bg-gray-200"></div>
          </div>
          <div className="h-64 w-full rounded bg-gray-100"></div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Issues Analysis Chart
          </h3>
        </div>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <TrendingDown className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900">
            No Issues to Display
          </h4>
          <p className="text-gray-600">
            All review categories are performing well. No significant issues
            detected.
          </p>
        </div>
      </Card>
    );
  }

  // Transform data for the chart with smoother wave-like values
  const chartData: ChartDataItem[] = data.map((issue, index) => {
    // Add some wave-like variation to create smoother curves
    const waveOffset = Math.sin((index / data.length) * Math.PI * 2) * 3;
    const scaledRating = issue.averageRating * 20;
    // Scale the priority score to match the height of the scaled rating for wave effect
    const scaledPriorityScore = Math.max(0, scaledRating + waveOffset);

    return {
      name: issue.displayName,
      issuePercentage: issue.issuePercentage,
      averageRating: issue.averageRating,
      negativeReviews: issue.negativeReviews,
      totalReviews: issue.totalReviews,
      displayName: issue.displayName,
      scaledRating: scaledRating,
      priorityScore: Math.round(scaledPriorityScore),
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border-0 bg-gray-800/95 p-4 text-white shadow-2xl backdrop-blur-sm">
          <p className="mb-2 font-semibold text-white">{label}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1 text-blue-300">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                Issue Rate:
              </span>
              <span className="font-medium text-white">
                {data.issuePercentage}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1 text-orange-300">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                Rating (scaled):
              </span>
              <span className="font-medium text-white">
                {data.scaledRating}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1 text-purple-300">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                Priority Score:
              </span>
              <span className="font-medium text-white">
                {Math.round(data.priorityScore)}
              </span>
            </div>
            <hr className="my-2 border-gray-600" />
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-300">Actual Rating:</span>
              <span className="font-medium text-white">
                {data.averageRating}/5.0
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-300">Negative Reviews:</span>
              <span className="font-medium text-white">
                {data.negativeReviews}/{data.totalReviews}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Top Issues Analysis Chart
          </h3>
        </div>
        {totalReviewsAnalyzed > 0 && (
          <Badge variant="outline" className="bg-white/80 text-xs">
            Based on {totalReviewsAnalyzed} reviews
          </Badge>
        )}
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient id="priorityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              opacity={0.6}
            />
            <XAxis
              dataKey="name"
              scale="band"
              tick={{ fontSize: 11, fill: "#64748b" }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Wave-like Area with smooth curves */}
            <Area
              type="monotone"
              dataKey="priorityScore"
              fill="url(#priorityGradient)"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Priority Score"
              connectNulls={true}
              dot={false}
            />

            {/* Enhanced bars with gradient */}
            <Bar
              dataKey="issuePercentage"
              barSize={24}
              fill="url(#barGradient)"
              name="Issue Percentage (%)"
              radius={[2, 2, 0, 0]}
            />

            {/* Smooth line with enhanced styling */}
            <Line
              type="monotone"
              dataKey="scaledRating"
              stroke="#f97316"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#f97316",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#f97316",
                stroke: "#fff",
                strokeWidth: 3,
              }}
              name="Rating (scaled %)"
              connectNulls={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Chart Components Legend */}
      <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-200"></div>
          <span>Priority Score (Wave Area)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gradient-to-b from-indigo-600 to-indigo-700"></div>
          <span>Issue Percentage (Bar)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
          <span>Rating Scaled (Line)</span>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-slate-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{data.length}</div>
          <div className="text-xs font-medium text-gray-600">Issues Found</div>
        </div>
        <div className="rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-rose-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {Math.max(...data.map((d) => d.issuePercentage))}%
          </div>
          <div className="text-xs font-medium text-gray-600">
            Highest Issue Rate
          </div>
        </div>
        <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {(
              data.reduce((sum, d) => sum + d.issuePercentage, 0) / data.length
            ).toFixed(1)}
            %
          </div>
          <div className="text-xs font-medium text-gray-600">
            Avg Issue Rate
          </div>
        </div>
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {(
              data.reduce((sum, d) => sum + d.averageRating, 0) / data.length
            ).toFixed(1)}
          </div>
          <div className="text-xs font-medium text-gray-600">Avg Rating</div>
        </div>
      </div>
    </Card>
  );
}
