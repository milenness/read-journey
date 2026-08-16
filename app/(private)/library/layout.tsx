import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "My Library",
  description:
    "Manage your personal book collection, track your reading progress, and organize your favorite reads on ReadJourney.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Fragment>{children}</Fragment>;
}
