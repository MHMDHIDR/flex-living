"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import type { Session } from "next-auth";

interface LandingNavProps {
  session: Session | null;
}

export function LandingNav({ session }: LandingNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Features",
      href: "#features",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      requiresAuth: true,
    },
    {
      name: "Contact",
      href: "#contact",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Flex Living Reviews
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              // Only show auth-required items if user is logged in
              if (item.requiresAuth && !session) return null;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user.name}
                </span>
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/api/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/api/auth/signin">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                // Only show auth-required items if user is logged in
                if (item.requiresAuth && !session) return null;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="py-2 text-gray-600 transition-colors hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
                {session ? (
                  <>
                    <span className="py-2 text-sm text-gray-600">
                      Welcome, {session.user.name}
                    </span>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full">Dashboard</Button>
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign Out
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/api/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/api/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
