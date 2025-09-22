import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function PropertyHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                the flex.
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden items-center space-x-8 md:flex">
            <div className="group relative">
              <button className="flex items-center font-medium text-gray-700 hover:text-gray-900">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
                </svg>
                Landlords
                <svg
                  className="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <Link
              href="/about"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              About Us
            </Link>

            <Link
              href="/careers"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Careers
            </Link>

            <Link
              href="/contact"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center text-gray-700">
              <Image
                src="https://flagcdn.com/gb.svg"
                alt="English"
                className="mr-2 h-5 w-5"
              />
              <span className="hidden font-medium md:inline">English</span>
            </div>

            {/* Currency */}
            <div className="hidden items-center font-medium text-gray-700 md:flex">
              <span>£ GBP</span>
            </div>

            {/* Dashboard Link */}
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
