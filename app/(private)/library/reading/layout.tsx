import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Reading Session",
  description:
    "Track your reading progress, log pages, and view reading statistics.",
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Fragment>{children}</Fragment>;
}
