import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ReviewsDashboard } from "@/app/_components/dashboard/reviews-dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto mt-10 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reviews Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and approve guest reviews for your properties
          </p>
        </div>

        <ReviewsDashboard />
      </div>
    </div>
  );
}
