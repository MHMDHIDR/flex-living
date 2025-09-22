import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";
import type { Session } from "next-auth";

interface LandingHeroProps {
  session: Session | null;
}

export function LandingHero({ session }: LandingHeroProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Manage Your Property Reviews
            <span className="text-blue-600"> Intelligently</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-xl leading-relaxed text-gray-600">
            Streamline guest review management across all channels. Monitor
            performance, approve content, and showcase your best reviews to
            attract more bookings.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            {session ? (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </>
            )}
          </div>

          {/* Feature Icons */}
          <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-blue-100 p-3">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Review Analytics</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Approval Workflow</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">
                Performance Tracking
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-orange-100 p-3">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Multi-Channel Sync</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl border bg-white p-8 shadow-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-blue-600">
                  99.9%
                </div>
                <div className="text-gray-600">Uptime Reliability</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-green-600">
                  50+
                </div>
                <div className="text-gray-600">Property Managers</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">
                  10K+
                </div>
                <div className="text-gray-600">Reviews Managed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
