import { HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { LandingHero } from "@/app/_components/landing/landing-hero";
import { LandingFeatures } from "@/app/_components/landing/landing-features";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        <LandingHero session={session} />

        <LandingFeatures />

        <footer className="bg-gray-900 py-12 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <h3 className="mb-4 text-xl font-bold">Flex Living</h3>
                <p className="text-gray-400">
                  Professional property management with intelligent review
                  handling. Streamline your operations and boost guest
                  satisfaction.
                </p>
              </div>

              <div className="md:col-start-4">
                <h4 className="mb-4 text-lg font-semibold">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Flex Living. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
