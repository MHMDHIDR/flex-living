import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { LandingHero } from "@/app/_components/landing/landing-hero";
import { LandingFeatures } from "@/app/_components/landing/landing-features";
import { LandingNav } from "@/app/_components/landing/landing-nav";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <LandingNav session={session} />

        {/* Hero Section */}
        <LandingHero session={session} />

        {/* Features Section */}
        <LandingFeatures />

        {/* Footer */}
        <footer className="border-t bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p>
                &copy; {new Date().getFullYear()} Flex Living. Professional
                property management made simple.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
