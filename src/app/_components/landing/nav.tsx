"use client";
import {
  NavbarWrapper,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "How It Works",
      link: "/#how-it-works",
    },
    {
      name: "Terms",
      link: "/terms",
    },
    {
      name: "Privacy",
      link: "/privacy",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <NavbarWrapper>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/">
            <Image
              src="/logo-slogan.png"
              alt="Flex Living Logo"
              width={150}
              height={150}
              className="h-10 w-auto"
            />
          </Link>
          <NavItems items={navItems} session={session} />

          <div className="flex items-center gap-4">
            {!session ? (
              <NavbarButton href="/api/auth/signin" variant="primary">
                Sign In
              </NavbarButton>
            ) : null}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/">
              <Image
                src="/logo-slogan.png"
                alt="Flex Living Logo"
                width={150}
                height={150}
                className="h-10 w-auto"
              />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {session ? (
                <>
                  <span className="py-2 text-sm text-gray-600 dark:text-gray-300">
                    Welcome, {session.user.name}
                  </span>
                  <NavbarButton
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Dashboard
                  </NavbarButton>
                  <NavbarButton
                    href="/api/auth/signout"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Sign Out
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    href="/api/auth/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Sign In
                  </NavbarButton>
                  <NavbarButton
                    href="/api/auth/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Get Started
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarWrapper>
    </div>
  );
}
