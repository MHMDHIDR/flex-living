import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";
import type { Session } from "next-auth";

interface LandingHeroProps {
  session: Session | null;
}

export function LandingHero({ session }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1724482606633-fa74fe4f5de1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      />

      {/* Blur Placeholder Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat opacity-30 blur-md"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRTVFN0VCIi8+Cjwvc3ZnPgo=')`,
        }}
      />

      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="mb-6 text-4xl leading-20 font-bold text-white drop-shadow-lg md:text-6xl">
            Manage Your Property Reviews
            <span className="text-blue-300"> Intelligently</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-xl leading-relaxed text-gray-100 drop-shadow-md">
            Streamline guest review management across all channels. Monitor
            performance, approve content, and showcase your best reviews to
            attract more bookings.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            {session ? (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full shadow-lg sm:w-auto">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button size="lg" className="w-full shadow-lg sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white sm:w-auto"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </>
            )}
          </div>

          {/* Feature Icons */}
          <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-blue-100/90 p-3 shadow-md backdrop-blur-sm">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-100 drop-shadow-sm">
                Review Analytics
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-green-100/90 p-3 shadow-md backdrop-blur-sm">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-100 drop-shadow-sm">
                Approval Workflow
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-purple-100/90 p-3 shadow-md backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-100 drop-shadow-sm">
                Performance Tracking
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-orange-100/90 p-3 shadow-md backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-100 drop-shadow-sm">
                Multi-Channel Sync
              </span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl border bg-white/95 p-8 shadow-xl backdrop-blur-md">
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
