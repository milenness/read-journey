import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "ReadJourney",
  description:
    "Explore recommended books, find your next great read, and expand your personal library on ReadJourney.",
};

export default function RecommendedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return <Fragment>{children}</Fragment>;
}
