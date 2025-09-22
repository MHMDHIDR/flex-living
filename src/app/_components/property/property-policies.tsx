import { Card } from "@/components/ui/card";
import {
  Clock,
  Home,
  Ban,
  PawPrint,
  PartyPopper,
  Shield,
  Calendar,
} from "lucide-react";

export function PropertyPolicies() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Stay Policies</h2>

      <div className="space-y-6">
        {/* Check-in & Check-out */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Check-in & Check-out
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-medium text-gray-500">
                Check-in Time
              </div>
              <div className="text-lg font-semibold text-gray-900">3:00 PM</div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-gray-500">
                Check-out Time
              </div>
              <div className="text-lg font-semibold text-gray-900">
                10:00 AM
              </div>
            </div>
          </div>
        </Card>

        {/* House Rules */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Home className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Ban className="h-5 w-5 text-red-500" />
              <span className="text-gray-700">No smoking</span>
            </div>
            <div className="flex items-center gap-3">
              <PawPrint className="h-5 w-5 text-red-500" />
              <span className="text-gray-700">No pets</span>
            </div>
            <div className="flex items-center gap-3">
              <PartyPopper className="h-5 w-5 text-red-500" />
              <span className="text-gray-700">No parties or events</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">Security deposit required</span>
            </div>
          </div>
        </Card>

        {/* Cancellation Policy */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cancellation Policy
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-gray-900">
                For stays less than 28 days
              </h4>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                  <span>Full refund up to 14 days before check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                  <span>
                    No refund for bookings less than 14 days before check-in
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-900">
                For stays of 28 days or more
              </h4>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                  <span>Full refund up to 30 days before check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                  <span>
                    No refund for bookings less than 30 days before check-in
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
