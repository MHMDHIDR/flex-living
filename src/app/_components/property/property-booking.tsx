import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  CreditCard,
  Phone,
  MessageSquare,
} from "lucide-react";

interface PropertyBookingProps {
  property: {
    id: string;
    name: string;
    city?: string | null;
  };
}

export function PropertyBooking({ property }: PropertyBookingProps) {
  return (
    <div className="space-y-6">
      {/* Booking Form Card */}
      <Card className="sticky top-6 p-6 shadow-lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 text-center">
            <h3 className="text-xl font-bold text-gray-900">Book Your Stay</h3>
            <p className="mt-1 text-sm text-gray-600">
              Check availability and rates
            </p>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10"
                    placeholder="Select date"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10"
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>

            {/* Guests Selection */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Select>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate per night</span>
                <span className="font-medium">£89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">£12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cleaning fee</span>
                <span className="font-medium">£25</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£126</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  *Final price may vary based on dates
                </p>
              </div>
            </div>

            {/* Booking Button */}
            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
              <CreditCard className="mr-2 h-4 w-4" />
              Book Now
            </Button>

            <div className="text-center text-xs text-gray-500">
              You won't be charged yet
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Options */}
      <Card className="p-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Need Help?</h4>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="mr-2 h-4 w-4" />
              Call us: +44 20 7946 0958
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Live Chat Support
            </Button>
          </div>

          <div className="pt-2 text-center text-xs text-gray-500">
            Available 24/7 for assistance
          </div>
        </div>
      </Card>

      {/* Property Quick Info */}
      <Card className="p-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Quick Info</h4>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Property Type:</span>
              <span className="font-medium">Apartment</span>
            </div>
            <div className="flex justify-between">
              <span>Bedrooms:</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between">
              <span>Bathrooms:</span>
              <span className="font-medium">1</span>
            </div>
            <div className="flex justify-between">
              <span>Max Guests:</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
