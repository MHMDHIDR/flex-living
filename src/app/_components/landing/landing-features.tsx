import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Filter,
  CheckCircle,
  Building2,
  Globe,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description:
        "Get detailed insights into your property performance with real-time metrics, rating trends, and channel distribution analysis.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description:
        "Filter reviews by rating, channel, property, date range, and approval status to quickly find what you need.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: CheckCircle,
      title: "Approval Workflow",
      description:
        "Review and approve guest feedback before it appears on your public website. Bulk actions for efficient management.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Building2,
      title: "Multi-Property Management",
      description:
        "Manage reviews across all your properties from a single dashboard. Compare performance and identify top performers.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Globe,
      title: "Multi-Channel Sync",
      description:
        "Automatically sync reviews from Hostaway, Google, Airbnb, and other platforms. All your reviews in one place.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description:
        "Get notified of new reviews instantly. Never miss feedback from your guests with real-time synchronization.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description:
        "Track approval rates, average ratings, and review volume over time. Identify trends and improve guest satisfaction.",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control. Your data is protected with industry-standard encryption.",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need to Manage Reviews
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Our comprehensive platform provides all the tools property
              managers need to monitor, analyze, and showcase guest reviews
              effectively.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div
                      className={`rounded-full p-3 ${feature.bgColor} w-fit`}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Process Section */}
          <div className="rounded-2xl bg-white p-8 shadow-lg" id="how-it-works">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                How It Works
              </h3>
              <p className="text-gray-600">
                Get started in minutes with our simple 3-step process
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  1
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  Connect Your Accounts
                </h4>
                <p className="text-gray-600">
                  Sync your Hostaway, Google, and other review platforms with
                  our secure integration.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                  2
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  Review & Approve
                </h4>
                <p className="text-gray-600">
                  Use our intuitive dashboard to review, filter, and approve the
                  best guest feedback.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
                  3
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  Showcase & Grow
                </h4>
                <p className="text-gray-600">
                  Display approved reviews on your website to attract more
                  bookings and build trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
