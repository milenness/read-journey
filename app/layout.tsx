import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Імпортуємо наш створений провайдер
import QueryProvider from "@/components/QueryProvider";

const gilroy = localFont({
  src: [
    {
      path: "../public/fonts/Gilroy-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
});

const sfProText = localFont({
  src: [
    {
      path: "../public/fonts/SFProText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: {
    default: "ReadJourney",
    template: "%s",
  },
  description:
    "Track your reading progress, organize your personal library, explore recommended books, and build consistent reading habits with Read Journey.",
  keywords: [
    "read journey",
    "book tracking",
    "personal library",
    "reading progress",
    "books catalog",
    "reading diary",
    "online reading statistics",
  ],
  authors: [{ name: "Read Journey Team" }],
  openGraph: {
    title: "Read Journey | Track Your Reading Progress",
    description:
      "Organize your personal library, track reading statistics, and discover new books to read on your journey.",
    url: "https://read-journey.com",
    siteName: "Read Journey",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${gilroy.variable} ${sfProText.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
