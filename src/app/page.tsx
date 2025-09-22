import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto p-8 pt-24">
          <h1 className="mb-4 text-center text-3xl font-bold">
            Reviews Dashboard Navigation
          </h1>
          <p className="mb-10 text-center text-sm text-zinc-500">
            Professional navigation component with authentication integration.
            The navbar adapts based on user authentication status.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              {
                id: 1,
                title: "Dashboard",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-blue-100 dark:bg-blue-800",
                description: "Access the full reviews management dashboard",
              },
              {
                id: 2,
                title: "Performance",
                width: "md:col-span-2",
                height: "h-60",
                bg: "bg-green-100 dark:bg-green-800",
                description:
                  "Monitor property performance and guest satisfaction",
              },
              {
                id: 3,
                title: "Analytics",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-purple-100 dark:bg-purple-800",
                description: "Deep insights into review trends and patterns",
              },
              {
                id: 4,
                title: "Multi-Channel",
                width: "md:col-span-3",
                height: "h-60",
                bg: "bg-orange-100 dark:bg-orange-800",
                description:
                  "Sync reviews from Hostaway, Google, Airbnb and more",
              },
              {
                id: 5,
                title: "Approval",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-teal-100 dark:bg-teal-800",
                description: "Review and approve content for public display",
              },
            ].map((box) => (
              <div
                key={box.id}
                className={`${box.width} ${box.height} ${box.bg} flex flex-col items-center justify-center rounded-lg p-4 shadow-sm`}
              >
                <h2 className="mb-2 text-xl font-medium">{box.title}</h2>
                <p className="text-center text-sm opacity-75">
                  {box.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
