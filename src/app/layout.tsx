import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { auth } from "@/server/auth";
import { Navbar } from "@/app/_components/landing/nav";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Flex Living",
  description: "Book Beautiful Stays",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Navbar session={session} />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
