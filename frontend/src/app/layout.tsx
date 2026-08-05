import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SchoolSphere AI",
    template: "%s | SchoolSphere AI",
  },
  description:
    "Intelligent school management platform powered by AI — attendance, grades, analytics, and insights for administrators, teachers, parents, and students.",
  keywords: ["school management", "education", "AI", "analytics", "SchoolSphere"],
  authors: [{ name: "SchoolSphere AI" }],
  creator: "SchoolSphere AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${fraunces.variable} min-h-screen font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
